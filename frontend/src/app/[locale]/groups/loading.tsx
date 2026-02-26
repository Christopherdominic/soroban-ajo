export default function GroupsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="skeleton h-9 w-56 rounded" />
            <div className="skeleton h-5 w-72 rounded" />
          </div>
          <div className="skeleton h-12 w-40 rounded-lg" />
        </div>

        <div className="space-y-4">
          <div className="skeleton h-24 w-full rounded-xl" />
          <div className="skeleton h-24 w-full rounded-xl" />
          <div className="skeleton h-24 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
