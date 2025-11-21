import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '../config/constants'
import mockVendors from '../data/mockVendors.json'

const useVendorStore = create(
  persist(
    (set, get) => ({
      vendors: mockVendors,
      
      addVendor: (vendor) => {
        const newVendor = {
          ...vendor,
          id: `V${String(get().vendors.length + 1).padStart(3, '0')}`,
          totalOrders: 0,
          totalSpent: 0
        }
        set((state) => ({ vendors: [...state.vendors, newVendor] }))
      },
      
      updateVendor: (id, updates) => {
        set((state) => ({
          vendors: state.vendors.map((v) => (v.id === id ? { ...v, ...updates } : v))
        }))
      },
      
      deleteVendor: (id) => {
        set((state) => ({
          vendors: state.vendors.filter((v) => v.id !== id)
        }))
      },
      
      getVendorById: (id) => {
        return get().vendors.find((v) => v.id === id)
      }
    }),
    {
      name: STORAGE_KEYS.VENDORS
    }
  )
)

export default useVendorStore
