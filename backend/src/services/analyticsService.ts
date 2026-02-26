import * as fs from 'fs'
import * as path from 'path'

const DATA_FILE = path.join(__dirname, '../../analytics-data.json')

interface StoredData {
  events: any[]
}

function loadData(): StoredData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    }
  } catch {}
  return { events: [] }
}

function saveData(data: StoredData) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('[AnalyticsService] Failed to save data:', err)
  }
}

export const analyticsService = {
  async saveEvent(type: string, data: any): Promise<void> {
    const stored = loadData()
    stored.events.push({ type, ...data, savedAt: Date.now() })
    if (stored.events.length > 10000) {
      stored.events = stored.events.slice(-10000)
    }
    saveData(stored)
  },

  async getStats() {
    const stored = loadData()
    const events = stored.events

    const eventsByType = Object.entries(
      events.reduce((acc: Record<string, number>, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1
        return acc
      }, {})
    ).map(([type, count]) => ({ type, count }))

    const eventsByCategory = Object.entries(
      events
        .filter((e) => e.category)
        .reduce((acc: Record<string, number>, e) => {
          acc[e.category] = (acc[e.category] || 0) + 1
          return acc
        }, {})
    ).map(([category, count]) => ({ category, count }))

    const errorEvents = events.filter((e) => e.type === 'error')
    const errorsBySeverity = Object.entries(
      errorEvents.reduce((acc: Record<string, number>, e) => {
        const sev = e.severity || 'medium'
        acc[sev] = (acc[sev] || 0) + 1
        return acc
      }, {})
    ).map(([severity, count]) => ({ severity, count }))

    return {
      totalEvents: events.length,
      eventsByType,
      eventsByCategory,
      errorsBySeverity,
      recentEvents: events.slice(-50).reverse(),
    }
  },

  async getMetrics() {
    const stored = loadData()
    return stored.events
      .filter((e) => e.type === 'metric')
      .slice(-100)
      .reverse()
  },
}
