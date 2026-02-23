export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      <div className="page-header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="skeleton h-10 w-56 rounded-lg" />
          <div className="skeleton h-5 w-72 rounded mt-3" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <div className="skeleton h-12 w-full max-w-md rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="skeleton h-44 w-full rounded-xl" />
          <div className="skeleton h-44 w-full rounded-xl" />
          <div className="skeleton h-44 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
