import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '../config/constants'
import mockPOs from '../data/mockPOs.json'

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
          approvedDate: null
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
