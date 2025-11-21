export const APP_NAME = 'Quantum ERP'
export const APP_VERSION = '1.0.0'

export const STATUS_OPTIONS = {
  PO: ['Draft', 'Pending', 'Approved', 'Rejected', 'Completed'],
  INVOICE: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
  ORDER: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
}

export const PAYMENT_TERMS = [
  'Net 30',
  'Net 60',
  'Net 90',
  'Due on Receipt',
  'Cash on Delivery'
]

export const CURRENCY = '$'

export const DATE_FORMAT = 'YYYY-MM-DD'

export const STORAGE_KEYS = {
  VENDORS: 'quantum_erp_vendors',
  CUSTOMERS: 'quantum_erp_customers',
  POS: 'quantum_erp_pos',
  INVOICES: 'quantum_erp_invoices',
  ORDER_TRACKING: 'quantum_erp_order_tracking'
}
