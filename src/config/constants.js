export const APP_NAME = 'Quantum ERP'
export const APP_VERSION = '1.0.0'

export const FX_RATE_USD_TO_PKR = 280;
export const CC_CHARGE_RATE = 0.01; // 1%
export const PROFIT_COMMISSION_RATE = 0.05; // 5%
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

// Updated Attention Categories
export const ATTENTION_CATEGORIES = [
  { value: 'po-received', label: 'PO Received', color: 'bg-blue-500' },
  { value: 'in-process', label: 'In Process', color: 'bg-amber-500' },
  { value: 'follow-up', label: 'Follow Up', color: 'bg-orange-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
  { value: 'cheque-awaited', label: 'Cheque Awaited', color: 'bg-purple-500' },
  { value: 'cheque-received', label: 'Cheque Received', color: 'bg-green-500' },
  { value: 'completed', label: 'Completed (Items Delivered)', color: 'bg-green-700' },
  { value: 'closed-chq-rec', label: 'Closed (Chq Rec)', color: 'bg-slate-500' },
  { value: 'closed-issue', label: 'Closed (Issue)', color: 'bg-gray-600' },
  { value: 'adjustment-net30', label: 'Adjustment Net 30', color: 'bg-indigo-500' },
];

// Updated Status Options
export const STATUS_OPTIONS = [
  { value: 'in-process', label: 'In Process', color: 'bg-amber-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
  { value: 'closed-check-received', label: 'Closed (Check Received)', color: 'bg-green-500' },
  { value: 'action-awaited', label: 'Action Awaited', color: 'bg-orange-500' },
  { value: 'check-awaited', label: 'Check Awaited', color: 'bg-purple-500' },
];

// Updated Payment Status
export const PAYMENT_STATUS_OPTIONS = [
  { value: 'due', label: 'Due', color: 'bg-red-500' },
  { value: 'due-this-week', label: 'Due This Week', color: 'bg-orange-500' },
  { value: 'due-today', label: 'Due Today', color: 'bg-red-700' },
  { value: 'paid', label: 'Paid', color: 'bg-green-500' },
  { value: 'net-30', label: 'Net 30', color: 'bg-blue-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-500' },
];

// Updated Supply Chain Stages
export const SUPPLY_CHAIN_STAGES = [
  { value: 'vendor-assessment', label: 'Vendor Assessment', color: 'bg-sky-500' },
  { value: 'initial-coord', label: 'Initial Coord Supplier', color: 'bg-blue-400' },
  { value: 're-sourcing', label: 'Re-Sourcing', color: 'bg-amber-500' },
  { value: 'qms-po-sent', label: 'QMS PO Sent', color: 'bg-yellow-500' },
  { value: 'payment-to-supplier', label: 'Payment to Supplier', color: 'bg-orange-500' },
  { value: 'shipped', label: 'Shipped from Supplier', color: 'bg-indigo-500' },
  { value: 'in-transit', label: 'In Transit', color: 'bg-purple-500' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-500' },
  { value: 'returned', label: 'Returned', color: 'bg-red-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-500' },
  { value: 'other', label: 'Other', color: 'bg-slate-500' },
  { value: 'waiting-period', label: 'Waiting Period', color: 'bg-cyan-500' },
  { value: 'check-awaited', label: 'Check Awaited', color: 'bg-violet-500' },
];

// CC Used Options
export const CC_USED_OPTIONS = [
  { value: 'ctbi-5364', label: 'CTBI 5364' },
  { value: 'personal-0597', label: 'Personal 0597' },
  { value: 'business-9869', label: 'Business 9869' },
  { value: 'ach-wire', label: 'ACH/WIRE' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const PAYMENT_TERMS = [
  'Net 30',
  'Net 60',
  'Net 90',
  'Due on Receipt',
  'Cash on Delivery'
]

export const CURRENCY = '$'

export const STORAGE_KEYS = {
  VENDORS: 'quantum_erp_vendors',
  CUSTOMERS: 'quantum_erp_customers',
  POS: 'quantum_erp_pos',
  INVOICES: 'quantum_erp_invoices',
  ORDER_TRACKING: 'quantum_erp_order_tracking',
  DATA_ARCHIVE: 'quantum_erp_data_archive'
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
