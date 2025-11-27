import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS, CC_CHARGE_RATE } from '../config/constants'
import mockOrderTracking from '../data/mockOrderTracking.json'

// Import commission store for auto-creation
// Note: This creates a circular dependency issue in some cases, 
// so we'll use a callback approach instead

const useOrderTrackingStore = create(
  persist(
    (set, get) => ({
      orders: mockOrderTracking,
      
      // Callback for commission creation (set by commission store)
      onOrderCreated: null,
      
      setOnOrderCreated: (callback) => {
        set({ onOrderCreated: callback })
      },
      
      addOrder: (order) => {
        const newOrder = {
          ...order,
          id: `ORD${String(get().orders.length + 1).padStart(3, '0')}`,
          status: 'Pending',
          ccChargeRate: order.ccChargeRate ?? CC_CHARGE_RATE
        }
        set((state) => ({ orders: [...state.orders, newOrder] }))
        
        // Trigger commission creation callback if set
        const callback = get().onOrderCreated
        if (callback) {
          callback(newOrder)
        }
        
        return newOrder
      },
      
      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map((order) => 
            order.id === id ? { ...order, ...updates } : order
          )
        }))
      },
      
      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id)
        }))
      },
      
      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id)
      }
    }),
    {
      name: STORAGE_KEYS.ORDER_TRACKING
    }
  )
)

export default useOrderTrackingStore
