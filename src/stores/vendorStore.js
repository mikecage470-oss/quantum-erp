import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '../config/constants'
import mockVendors from '../data/mockVendors.json'
import useOrderTrackingStore from './orderTrackingStore'

const useVendorStore = create(
  persist(
    (set, get) => ({
      vendors: mockVendors,
      
      addVendor: (vendor) => {
        const newVendor = {
          ...vendor,
          id: `V${String(get().vendors.length + 1).padStart(3, '0')}`
        }
        set((state) => ({ vendors: [...state.vendors, newVendor] }))
        
        // Auto-update matching order in Order Tracking by QMS ID
        const orderStore = useOrderTrackingStore.getState()
        const matchingOrder = orderStore.orders.find(
          (order) => order.qmsId === vendor.qmsId
        )
        
        if (matchingOrder) {
          orderStore.updateOrder(matchingOrder.id, {
            vendorName: vendor.name,
            vendorProductLink: vendor.vendorProductLink || '',
            vendorAmount: vendor.vendorAmount || 0,
            specialExpenses: vendor.specialExpense || 0,
            paymentStatus: vendor.paymentStatus || 'due'
          })
          return { success: true, orderUpdated: true, orderId: matchingOrder.id }
        }
        
        return { success: true, orderUpdated: false }
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
      },
      
      findOrderByQmsId: (qmsId) => {
        const orderStore = useOrderTrackingStore.getState()
        return orderStore.orders.find((order) => order.qmsId === qmsId)
      }
    }),
    {
      name: STORAGE_KEYS.VENDORS
    }
  )
)

export default useVendorStore
