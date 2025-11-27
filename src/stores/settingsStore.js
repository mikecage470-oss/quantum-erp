import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const STORAGE_KEY = 'quantum_erp_settings'

const useSettingsStore = create(
  persist(
    (set, get) => ({
      usdToPkrRate: 278.00,
      
      setUsdToPkrRate: (rate) => {
        set({ usdToPkrRate: rate })
      },
      
      getUsdToPkrRate: () => {
        return get().usdToPkrRate
      }
    }),
    {
      name: STORAGE_KEY
    }
  )
)

export default useSettingsStore
