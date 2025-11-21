export const APP_NAME = 'Quantum ERP'
export const APP_VERSION = '1.0.0'

export const FX_RATE_USD_TO_PKR = 280;
export const CC_CHARGE_RATE = 0.01; // 1%
export const PROFIT_COMMISSION_RATE = 0.05; // 5%
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

// Updated Attention Categories
export const ATTENTION_CATEGORIES = [
  { value: 'po-received', label: 'PO Received' },
  { value: 'in-process', label: 'In Process' },
  { value: 'follow-up', label: 'Follow Up' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'cheque-awaited', label: 'Cheque Awaited' },
  { value: 'cheque-received', label: 'Cheque Received' },
  { value: 'completed', label: 'Completed (Items Delivered)' },
  { value: 'closed-chq-rec', label: 'Closed (Chq Rec)' },
  { value: 'closed-issue', label: 'Closed (Issue)' },
  { value: 'adjustment-net30', label: 'Adjustment Net 30' },
];

// Updated Status Options
export const STATUS_OPTIONS = [
  { value: 'in-process', label: 'In Process' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'closed-check-received', label: 'Closed (Check Received)' },
  { value: 'action-awaited', label: 'Action Awaited' },
  { value: 'check-awaited', label: 'Check Awaited' },
];

// Updated Payment Status
export const PAYMENT_STATUS_OPTIONS = [
  { value: 'due', label: 'Due' },
  { value: 'due-this-week', label: 'Due This Week' },
  { value: 'due-today', label: 'Due Today' },
  { value: 'paid', label: 'Paid' },
  { value: 'net-30', label: 'Net 30' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Updated Supply Chain Stages
export const SUPPLY_CHAIN_STAGES = [
  { value: 'vendor-assessment', label: 'Vendor Assessment' },
  { value: 'initial-coord', label: 'Initial Coord Supplier' },
  { value: 're-sourcing', label: 'Re-Sourcing' },
  { value: 'qms-po-sent', label: 'QMS PO Sent' },
  { value: 'payment-to-supplier', label: 'Payment to Supplier' },
  { value: 'shipped', label: 'Shipped from Supplier' },
  { value: 'in-transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'returned', label: 'Returned' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'other', label: 'Other' },
  { value: 'waiting-period', label: 'Waiting Period' },
  { value: 'check-awaited', label: 'Check Awaited' },
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
  ORDER_TRACKING: 'quantum_erp_order_tracking'
}
