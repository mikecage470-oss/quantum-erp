import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '../config/constants'
import mockCustomers from '../data/mockCustomers.json'

const useCustomerStore = create(
  persist(
    (set, get) => ({
      customers: mockCustomers,
      
      addCustomer: (customer) => {
        const newCustomer = {
          ...customer,
          id: `C${String(get().customers.length + 1).padStart(3, '0')}`,
          totalOrders: 0,
          lifetimeValue: 0,
          accountBalance: 0
        }
        set((state) => ({ customers: [...state.customers, newCustomer] }))
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
