import Commission from '@/components/commission/Commission'

export default function CommissionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Commission</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track commission payments and distribution across team members
        </p>
      </div>

      <Commission />
    </div>
  )
}
