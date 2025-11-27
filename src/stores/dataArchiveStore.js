import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '../config/constants'

const useDataArchiveStore = create(
  persist(
    (set, get) => ({
      archivedOrders: [],
      
      archiveOrder: (order, archiveDate) => {
        const date = new Date(archiveDate)
        const archivedMonth = date.getMonth() + 1
        const archivedYear = date.getFullYear()
        
        const archivedOrder = {
          ...order,
          archiveDate: archiveDate,
          archivedAt: new Date().toISOString(),
          archivedMonth,
          archivedYear
        }
        
        set((state) => ({
          archivedOrders: [...state.archivedOrders, archivedOrder]
        }))
        
        return archivedOrder
      },
      
      getOrdersByYear: (year) => {
        return get().archivedOrders.filter(order => order.archivedYear === year)
      },
      
      getOrdersByMonth: (year, month) => {
        return get().archivedOrders.filter(
          order => order.archivedYear === year && order.archivedMonth === month
        )
      },
      
      getYearSummary: (year) => {
        const orders = get().getOrdersByYear(year)
        const totalCustomerPOAmount = orders.reduce((sum, order) => sum + (order.poAmount || 0), 0)
        const totalVendorAmount = orders.reduce((sum, order) => sum + (order.vendorAmount || 0), 0)
        const totalAdditionalCharges = orders.reduce((sum, order) => sum + (order.specialExpenses || 0), 0)
        const totalCCCharges = orders.reduce((sum, order) => {
          const ccChargeRate = order.ccChargeRate ?? 0.01
          const grossProfit = (order.poAmount || 0) - (order.vendorAmount || 0) - (order.specialExpenses || 0)
          return sum + (grossProfit * ccChargeRate)
        }, 0)
        const actualProfit = totalCustomerPOAmount - totalVendorAmount - totalAdditionalCharges - totalCCCharges
        
        return {
          year,
          totalCustomerPOAmount,
          totalVendorAmount,
          totalAdditionalCharges,
          totalCCCharges,
          actualProfit,
          orderCount: orders.length
        }
      },
      
      getMonthSummary: (year, month) => {
        const orders = get().getOrdersByMonth(year, month)
        const totalCustomerPOAmount = orders.reduce((sum, order) => sum + (order.poAmount || 0), 0)
        const totalVendorAmount = orders.reduce((sum, order) => sum + (order.vendorAmount || 0), 0)
        const totalAdditionalCharges = orders.reduce((sum, order) => sum + (order.specialExpenses || 0), 0)
        const totalCCCharges = orders.reduce((sum, order) => {
          const ccChargeRate = order.ccChargeRate ?? 0.01
          const grossProfit = (order.poAmount || 0) - (order.vendorAmount || 0) - (order.specialExpenses || 0)
          return sum + (grossProfit * ccChargeRate)
        }, 0)
        const actualProfit = totalCustomerPOAmount - totalVendorAmount - totalAdditionalCharges - totalCCCharges
        
        return {
          year,
          month,
          totalCustomerPOAmount,
          totalVendorAmount,
          totalAdditionalCharges,
          totalCCCharges,
          actualProfit,
          orderCount: orders.length
        }
      },
      
      getAllYears: () => {
        const years = [...new Set(get().archivedOrders.map(order => order.archivedYear))]
        return years.sort((a, b) => b - a)
      },
      
      getMonthsForYear: (year) => {
        const orders = get().getOrdersByYear(year)
        const months = [...new Set(orders.map(order => order.archivedMonth))]
        return months.sort((a, b) => a - b)
      },
      
      removeArchivedOrder: (orderId) => {
        set((state) => ({
          archivedOrders: state.archivedOrders.filter(order => order.id !== orderId)
        }))
      },
      
      updateArchivedOrder: (orderId, updates) => {
        set((state) => {
          const updatedOrders = state.archivedOrders.map(order => {
            if (order.id === orderId) {
              // If archiveDate changed, recalculate archivedMonth and archivedYear
              if (updates.archiveDate && updates.archiveDate !== order.archiveDate) {
                const date = new Date(updates.archiveDate)
                return {
                  ...order,
                  ...updates,
                  archivedMonth: date.getMonth() + 1,
                  archivedYear: date.getFullYear()
                }
              }
              return { ...order, ...updates }
            }
            return order
          })
          return { archivedOrders: updatedOrders }
        })
      },
      
      deleteArchivedOrder: (orderId) => {
        set((state) => ({
          archivedOrders: state.archivedOrders.filter(order => order.id !== orderId)
        }))
      }
    }),
    {
      name: STORAGE_KEYS.DATA_ARCHIVE
    }
  )
)

export default useDataArchiveStore
