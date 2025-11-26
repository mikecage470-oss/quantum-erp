import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Vendors from './pages/Vendors'
import Customers from './pages/Customers'
import PurchaseOrders from './pages/PurchaseOrders'
import Invoices from './pages/Invoices'
import OrderTracking from './pages/OrderTracking'
import DataArchive from './pages/DataArchive'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="customers" element={<Customers />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="order-tracking" element={<OrderTracking />} />
          <Route path="data-archive" element={<DataArchive />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
