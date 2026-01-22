import { ref, watch } from 'vue'

/**
 * Composable for localStorage persistence
 * Automatically syncs a ref with localStorage
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const value = ref<T>(defaultValue)

  // Check if localStorage is available
  function hasLocalStorage(): boolean {
    const test = '_test-local-storage'
    try {
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  }

  // Load from localStorage on creation
  if (hasLocalStorage()) {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        value.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error(`Error loading from localStorage (${key}):`, error)
    }
  }

  // Watch for changes and sync to localStorage
  watch(
    value,
    (newValue) => {
      if (hasLocalStorage()) {
        try {
          localStorage.setItem(key, JSON.stringify(newValue))
        } catch (error) {
          console.error(`Error saving to localStorage (${key}):`, error)
        }
      }
    },
    { deep: true }
  )

  return value
}
