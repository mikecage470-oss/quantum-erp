import DataArchive from '@/components/data-archive/DataArchive'

export default function DataArchivePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Archive</h1>
        <p className="mt-2 text-sm text-gray-600">
          View archived orders organized by year and month with financial summaries
        </p>
      </div>

      <DataArchive />
    </div>
  )
}
