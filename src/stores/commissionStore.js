import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const STORAGE_KEY = 'quantum_erp_commission'

// Commission Payment Status Options
export const COMMISSION_PAYMENT_STATUS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'payment-made', label: 'Payment Made', color: 'bg-green-500' },
  { value: 'no-payment-req', label: 'No Payment Req', color: 'bg-gray-500' },
  { value: 'verification-required', label: 'Verification on In/Out Req', color: 'bg-blue-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
]

// Commission Status Options
export const COMMISSION_STATUS = [
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
]

const useCommissionStore = create(
  persist(
    (set, get) => ({
      commissions: [],
      
      addCommission: (commission) => {
        const newCommission = {
          ...commission,
          id: `COM${String(get().commissions.length + 1).padStart(4, '0')}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        set((state) => ({ commissions: [...state.commissions, newCommission] }))
        return newCommission
      },
      
      updateCommission: (id, updates) => {
        set((state) => ({
          commissions: state.commissions.map((commission) => 
            commission.id === id 
              ? { ...commission, ...updates, updatedAt: new Date().toISOString() } 
              : commission
          )
        }))
      },
      
      deleteCommission: (id) => {
        set((state) => ({
          commissions: state.commissions.filter((commission) => commission.id !== id)
        }))
      },
      
      getCommissionById: (id) => {
        return get().commissions.find((commission) => commission.id === id)
      },

      getCommissionByOrderId: (orderId) => {
        return get().commissions.find((commission) => commission.orderId === orderId)
      },
      
      getCommissionsByYear: (year) => {
        return get().commissions.filter(commission => {
          const date = new Date(commission.submissionDate)
          return date.getFullYear() === year
        })
      },
      
      getCommissionsByMonth: (year, month) => {
        return get().commissions.filter(commission => {
          const date = new Date(commission.submissionDate)
          return date.getFullYear() === year && (date.getMonth() + 1) === month
        })
      },
      
      getYearSummary: (year) => {
        const commissions = get().getCommissionsByYear(year)
        const totalCustomerPOAmount = commissions.reduce((sum, c) => sum + (c.poAmount || 0), 0)
        const totalVendorAmount = commissions.reduce((sum, c) => sum + (c.vendorAmount || 0), 0)
        const totalAdditionalCharges = commissions.reduce((sum, c) => sum + (c.additionalCharges || 0), 0)
        const totalCCCharges = commissions.reduce((sum, c) => sum + (c.ccCharges || 0), 0)
        const totalCommissionAmount = commissions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0)
        const netProfit = totalCustomerPOAmount - totalVendorAmount - totalAdditionalCharges - totalCCCharges - totalCommissionAmount
        
        return {
          year,
          totalCustomerPOAmount,
          totalVendorAmount,
          totalAdditionalCharges,
          totalCCCharges,
          totalCommissionAmount,
          netProfit,
          commissionCount: commissions.length
        }
      },
      
      getMonthSummary: (year, month) => {
        const commissions = get().getCommissionsByMonth(year, month)
        const totalCustomerPOAmount = commissions.reduce((sum, c) => sum + (c.poAmount || 0), 0)
        const totalVendorAmount = commissions.reduce((sum, c) => sum + (c.vendorAmount || 0), 0)
        const totalAdditionalCharges = commissions.reduce((sum, c) => sum + (c.additionalCharges || 0), 0)
        const totalCCCharges = commissions.reduce((sum, c) => sum + (c.ccCharges || 0), 0)
        const totalCommissionAmount = commissions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0)
        const netProfit = totalCustomerPOAmount - totalVendorAmount - totalAdditionalCharges - totalCCCharges - totalCommissionAmount
        
        return {
          year,
          month,
          totalCustomerPOAmount,
          totalVendorAmount,
          totalAdditionalCharges,
          totalCCCharges,
          totalCommissionAmount,
          netProfit,
          commissionCount: commissions.length
        }
      },
      
      getAllYears: () => {
        const years = [...new Set(get().commissions.map(commission => {
          const date = new Date(commission.submissionDate)
          return date.getFullYear()
        }))]
        return years.sort((a, b) => b - a)
      },
      
      getMonthsForYear: (year) => {
        const commissions = get().getCommissionsByYear(year)
        const months = [...new Set(commissions.map(commission => {
          const date = new Date(commission.submissionDate)
          return date.getMonth() + 1
        }))]
        return months.sort((a, b) => a - b)
      },
      
      // Create commission from order
      createCommissionFromOrder: (order) => {
        const ccChargeRate = order.ccChargeRate ?? 0.01
        const grossProfit = (order.poAmount || 0) - (order.vendorAmount || 0) - (order.specialExpenses || 0)
        const ccCharges = grossProfit * ccChargeRate
        const actualProfit = grossProfit - ccCharges
        const defaultCommissionPercent = 20
        const commissionAmount = actualProfit * (defaultCommissionPercent / 100)
        
        const commission = {
          orderId: order.id,
          qmsId: order.qmsId || '',
          sourcer: order.sourcer || '',
          submissionDate: order.submissionDate || new Date().toISOString().split('T')[0],
          customerPO: order.customerPO || '',
          customerPOIssueDate: order.customerPOIssueDate || '',
          customer: order.customer || '',
          status: 'active',
          poAmount: order.poAmount || 0,
          vendorAmount: order.vendorAmount || 0,
          additionalCharges: order.specialExpenses || 0,
          ccCharges: ccCharges,
          actualProfit: actualProfit,
          commissionPercent: defaultCommissionPercent,
          commissionAmount: commissionAmount,
          anticipatedChequeDate: order.anticipatedChequeDate || '',
          anticipatedPaymentDate: '',
          paymentMade: 'pending',
          paymentDetails: '',
          
          // Distribution
          hunterName: order.hunter || '',
          hunterPercent: 0,
          hunterAmount: 0,
          sourcerName: order.sourcer || '',
          sourcerPercent: 0,
          sourcerAmount: 0,
          submitterName: '',
          submitterPercent: 0,
          submitterAmount: 0,
          executorName: '',
          executorPercent: 0,
          executorAmount: 0,
        }
        
        return get().addCommission(commission)
      }
    }),
    {
      name: STORAGE_KEY
    }
  )
)

export default useCommissionStore
