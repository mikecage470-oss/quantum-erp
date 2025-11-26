import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS, CC_CHARGE_RATE } from '../config/constants'
import mockCustomers from '../data/mockCustomers.json'
import useOrderTrackingStore from './orderTrackingStore'

const useCustomerStore = create(
  persist(
    (set, get) => ({
      customers: mockCustomers,
      
      addCustomer: (customer) => {
        const newCustomer = {
          ...customer,
          id: `C${String(get().customers.length + 1).padStart(3, '0')}`
        }
        set((state) => ({ customers: [...state.customers, newCustomer] }))
        
        // Auto-create order in Order Tracking
        const orderTrackingStore = useOrderTrackingStore.getState()
        const orderNumber = orderTrackingStore.orders.length + 1
        const newOrder = {
          orderId: `ORD-${String(orderNumber).padStart(4, '0')}`,
          customer: customer.customer,
          customerName: customer.customerName,
          customerEmail: customer.customerEmail,
          customerPO: customer.customerPO,
          poAmount: parseFloat(customer.poAmount) || 0,
          qmsId: customer.qmsId,
          ccChargeRate: CC_CHARGE_RATE,
          attentionCategory: 'po-received',
          status: 'in-process',
          paymentStatus: 'due',
          supplyChainStage: 'vendor-assessment',
          vendorAmount: 0,
          specialExpenses: 0,
          detailsOfSpecialExpense: '',
          ccUsed: '',
          paymentDate: null,
          customerPOIssueDate: new Date().toISOString().split('T')[0],
          submissionDate: new Date().toISOString().split('T')[0],
          customerDeliveryRequirementDate: '',
          statusDetail: '',
          hunter: '',
          sourcer: '',
          qmsPO: '',
          qmsInvoice: '',
          invoiceDate: null,
          itemDescription: '',
          vendorName: '',
          vendorProductLink: '',
          anticipatedChequeDate: '',
          joeNotes: '',
          jackNotes: '',
          adminNotes: ''
        }
        orderTrackingStore.addOrder(newOrder)
      },
      
      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c))
        }))
      },
      
      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id)
        }))
      },
      
      getCustomerById: (id) => {
        return get().customers.find((c) => c.id === id)
      }
    }),
    {
      name: STORAGE_KEYS.CUSTOMERS
    }
  )
)

export default useCustomerStore
