module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#06B6D4',
      },
      backgroundImage: {
        'pattern-mesh': "url('/patterns/stellar-mesh.svg')",
        'pattern-constellation': "url('/patterns/stellar-constellation.svg')",
        'pattern-grid': "url('/patterns/stellar-grid.svg')",
        'pattern-hexagon': "url('/patterns/stellar-hexagon.svg')",
        'pattern-waves': "url('/patterns/stellar-waves.svg')",
        'gradient-stellar': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)',
        'gradient-stellar-soft': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(6, 182, 212, 0.1) 100%)',
        'gradient-radial-stellar': 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 100%)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 30s linear infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
