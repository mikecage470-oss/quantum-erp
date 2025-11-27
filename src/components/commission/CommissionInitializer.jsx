import { useEffect } from 'react'
import useOrderTrackingStore from '@/stores/orderTrackingStore'
import useCommissionStore from '@/stores/commissionStore'

export default function CommissionInitializer() {
  const setOnOrderCreated = useOrderTrackingStore((state) => state.setOnOrderCreated)
  const createCommissionFromOrder = useCommissionStore((state) => state.createCommissionFromOrder)

  useEffect(() => {
    // Set up the callback to auto-create commission when order is created
    setOnOrderCreated((order) => {
      createCommissionFromOrder(order)
    })

    // Clean up on unmount
    return () => {
      setOnOrderCreated(null)
    }
  }, [setOnOrderCreated, createCommissionFromOrder])

  return null
}
