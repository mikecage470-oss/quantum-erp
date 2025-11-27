import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  ShoppingCart, 
  FileText, 
  Package, 
  Archive,
  Percent,
  Settings 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/config/constants'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Vendors', href: '/vendors', icon: Users },
  { name: 'Customers', href: '/customers', icon: UserCircle },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Order Tracking', href: '/order-tracking', icon: Package },
  { name: 'Data Archive', href: '/data-archive', icon: Archive },
  { name: 'Commission', href: '/commission', icon: Percent },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-blue-900 text-white">
      <div className="flex items-center justify-center h-16 bg-blue-950 px-4">
        <h1 className="text-xl font-bold">{APP_NAME}</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-6 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-800 text-white border-l-4 border-blue-400'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              )
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-xs text-blue-300 border-t border-blue-800">
        <p>&copy; 2024 {APP_NAME}</p>
        <p className="mt-1">Version 1.0.0</p>
      </div>
    </div>
  )
}
