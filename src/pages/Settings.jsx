import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { APP_NAME, APP_VERSION } from '@/config/constants'
import useSettingsStore from '@/stores/settingsStore'
import { Trash2, DollarSign, Save } from 'lucide-react'

export default function Settings() {
  const { usdToPkrRate, setUsdToPkrRate } = useSettingsStore()
  const [exchangeRate, setExchangeRate] = useState(usdToPkrRate)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    setExchangeRate(usdToPkrRate)
  }, [usdToPkrRate])

  const handleSaveExchangeRate = () => {
    setUsdToPkrRate(exchangeRate)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

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

        {/* USD to PKR Exchange Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Currency Exchange Rate
            </CardTitle>
            <CardDescription>
              Configure the USD to PKR exchange rate for commission calculations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {saveSuccess && (
              <div className="p-3 rounded-md text-sm bg-green-50 text-green-700 border border-green-200">
                Exchange rate saved successfully!
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="exchangeRate">USD to PKR Exchange Rate</Label>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input
                    id="exchangeRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                    placeholder="278.00"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    1 USD = {exchangeRate.toFixed(2)} PKR
                  </p>
                </div>
                <Button onClick={handleSaveExchangeRate} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Rate
                </Button>
              </div>
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
                Commission tracking and distribution
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
