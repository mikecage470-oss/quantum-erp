import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS, CC_CHARGE_RATE } from '../config/constants'
import mockOrderTracking from '../data/mockOrderTracking.json'

const useOrderTrackingStore = create(
  persist(
    (set, get) => ({
      orders: mockOrderTracking,
      
      addOrder: (order) => {
        const newOrder = {
          ...order,
          id: `ORD${String(get().orders.length + 1).padStart(3, '0')}`,
          status: 'Pending',
          ccChargeRate: order.ccChargeRate ?? CC_CHARGE_RATE
        }
        set((state) => ({ orders: [...state.orders, newOrder] }))
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
