export default function AppLoading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="skeleton h-10 w-48 rounded-lg" />
        <div className="skeleton h-28 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="skeleton h-24 w-full rounded-lg" />
          <div className="skeleton h-24 w-full rounded-lg" />
          <div className="skeleton h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
