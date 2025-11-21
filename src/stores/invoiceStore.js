import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '../config/constants'
import mockInvoices from '../data/mockInvoices.json'

const useInvoiceStore = create(
  persist(
    (set, get) => ({
      invoices: mockInvoices,
      
      addInvoice: (invoice) => {
        const newInvoice = {
          ...invoice,
          id: `INV${String(get().invoices.length + 1).padStart(3, '0')}`,
          status: 'Draft',
          amountPaid: 0,
          paidDate: null
        }
        set((state) => ({ invoices: [...state.invoices, newInvoice] }))
      },
      
      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map((inv) => 
            inv.id === id ? { ...inv, ...updates } : inv
          )
        }))
      },
      
      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id)
        }))
      },
      
      getInvoiceById: (id) => {
        return get().invoices.find((inv) => inv.id === id)
      },
      
      markAsPaid: (id) => {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id
              ? {
                  ...inv,
                  status: 'Paid',
                  amountPaid: inv.total,
                  paidDate: new Date().toISOString().split('T')[0]
                }
              : inv
          )
        }))
      }
    }),
    {
      name: STORAGE_KEYS.INVOICES
    }
  )
)

export default useInvoiceStore
