import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '../config/constants'
import mockPOs from '../data/mockPOs.json'

const DEFAULT_COMPANY_NAME = 'Quantum Concierge Services LLC'
const DEFAULT_COMPANY_ADDRESS = '208 Somersly PL, Lexington KY, 40515'

const usePOStore = create(
  persist(
    (set, get) => ({
      purchaseOrders: mockPOs,
      
      addPurchaseOrder: (po) => {
        const newPO = {
          ...po,
          id: `PO${String(get().purchaseOrders.length + 1).padStart(3, '0')}`,
          status: 'Draft',
          approvedBy: null,
          approvedDate: null,
          // Ensure default values for new fields
          companyName: po.companyName || DEFAULT_COMPANY_NAME,
          companyAddress: po.companyAddress || DEFAULT_COMPANY_ADDRESS,
          subtotal: po.subtotal || 0,
          taxRate: po.taxRate || 0,
          discount: po.discount || 0,
          shipping: po.shipping || 0,
          termsAndConditions: po.termsAndConditions || '',
          companyLogo: po.companyLogo || '',
          qmsId: po.qmsId || '',
          qmsPO: po.qmsPO || '',
          vendorAddress: po.vendorAddress || '',
          shipToAddress: po.shipToAddress || '',
          paymentTerms: po.paymentTerms || 'Net 30',
          shippingMethod: po.shippingMethod || 'Ground'
        }
        set((state) => ({ purchaseOrders: [...state.purchaseOrders, newPO] }))
      },
      
      updatePurchaseOrder: (id, updates) => {
        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((po) => 
            po.id === id ? { ...po, ...updates } : po
          )
        }))
      },
      
      deletePurchaseOrder: (id) => {
        set((state) => ({
          purchaseOrders: state.purchaseOrders.filter((po) => po.id !== id)
        }))
      },
      
      getPOById: (id) => {
        return get().purchaseOrders.find((po) => po.id === id)
      },
      
      approvePO: (id, approvedBy) => {
        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((po) =>
            po.id === id
              ? {
                  ...po,
                  status: 'Approved',
                  approvedBy,
                  approvedDate: new Date().toISOString().split('T')[0]
                }
              : po
          )
        }))
      }
    }),
    {
      name: STORAGE_KEYS.POS
    }
  )
)

export default usePOStore
