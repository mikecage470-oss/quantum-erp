import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { APP_NAME, APP_VERSION } from '@/config/constants'
import { Trash2 } from 'lucide-react'

export default function Settings() {
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your application settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
            <CardDescription>
              System information and version details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Application Name</Label>
              <p className="text-lg font-semibold mt-1">{APP_NAME}</p>
            </div>
            <Separator />
            <div>
              <Label>Version</Label>
              <p className="text-lg font-semibold mt-1">{APP_VERSION}</p>
            </div>
            <Separator />
            <div>
              <Label>Description</Label>
              <p className="text-sm text-gray-600 mt-1">
                A modern, frontend-only Enterprise Resource Planning (ERP) system built with
                React, Vite, and TailwindCSS. All data is stored locally in your browser.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure general application preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="Your Company Name"
                defaultValue=""
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@company.com"
                defaultValue=""
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                defaultValue=""
              />
            </div>
            <Button className="mt-4">Save Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manage your application data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Local Storage</Label>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                All data is stored locally in your browser. Clearing data will reset the application
                to its initial state with sample data.
              </p>
              <Button
                variant="destructive"
                onClick={handleClearData}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              Available features in this application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Dashboard with real-time statistics
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Vendor management
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Customer relationship management
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Purchase order creation and tracking
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Invoice generation and management
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Advanced order tracking with filtering
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                CSV and Excel export capabilities
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                LocalStorage data persistence
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
