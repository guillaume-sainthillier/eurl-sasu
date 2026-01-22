import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SavedState } from '@/types/calculator.types'

const STORAGE_KEY = 'eurl-sasu-saved-states'

export const useSavedStatesStore = defineStore('savedStates', () => {
  // State
  const savedStates = ref<SavedState[]>([])
  const currentStateName = ref<string>('')

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

  // Actions
  function loadStates() {
    if (!hasLocalStorage()) {
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        savedStates.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading saved states:', error)
      savedStates.value = []
    }
  }

  function persistStates() {
    if (!hasLocalStorage()) {
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStates.value))
    } catch (error) {
      console.error('Error saving states:', error)
    }
  }

  function saveState(name: string, year: number, params: any) {
    if (!hasLocalStorage()) {
      return
    }

    // Check if state with this name already exists
    const existingIndex = savedStates.value.findIndex((state) => state.name === name)

    const newState: SavedState = {
      name,
      year,
      params: JSON.parse(JSON.stringify(params)), // Deep copy
      savedAt: Date.now()
    }

    if (existingIndex >= 0) {
      // Update existing state
      savedStates.value[existingIndex] = newState
    } else {
      // Add new state
      savedStates.value.push(newState)
    }

    currentStateName.value = name
    persistStates()
  }

  function loadState(name: string): SavedState | null {
    const state = savedStates.value.find((s) => s.name === name)
    if (state) {
      currentStateName.value = name
      return state
    }
    return null
  }

  function deleteState(name: string) {
    const index = savedStates.value.findIndex((s) => s.name === name)
    if (index >= 0) {
      savedStates.value.splice(index, 1)
      persistStates()

      if (currentStateName.value === name) {
        currentStateName.value = ''
      }
    }
  }

  function clearAllStates() {
    if (confirm('Êtes-vous certain de vouloir supprimer toutes vos sauvegardes ?')) {
      savedStates.value = []
      currentStateName.value = ''
      persistStates()
    }
  }

  function exportStates(): string {
    return JSON.stringify(savedStates.value, null, 2)
  }

  function importStates(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData) as SavedState[]
      // Validate the structure
      if (Array.isArray(imported)) {
        savedStates.value = imported
        persistStates()
        return true
      }
      return false
    } catch (error) {
      console.error('Error importing states:', error)
      return false
    }
  }

  // Initialize on store creation
  loadStates()

  return {
    // State
    savedStates,
    currentStateName,
    // Actions
    saveState,
    loadState,
    deleteState,
    clearAllStates,
    exportStates,
    importStates,
    hasLocalStorage
  }
})
