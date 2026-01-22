import { computed } from 'vue'
import { useCalculatorStore } from '@/stores/calculator'
import { useSavedStatesStore } from '@/stores/savedStates'

/**
 * Composable for calculator functionality
 * Provides easy access to calculator state and actions
 */
export function useCalculation() {
  const calculatorStore = useCalculatorStore()
  const savedStatesStore = useSavedStatesStore()

  // Calculator state
  const selectedYear = computed(() => calculatorStore.selectedYear)
  const params = computed(() => calculatorStore.params)
  const yearConfig = computed(() => calculatorStore.yearConfig)
  const availableFeatures = computed(() => calculatorStore.availableFeatures)
  const result = computed(() => calculatorStore.calculationResult)

  // URL sharing
  const shareableUrl = computed(() => {
    const baseUrl = window.location.origin + window.location.pathname
    const urlParams = new URLSearchParams()

    // Add year
    urlParams.set('year', selectedYear.value.toString())

    // Add all params
    Object.entries(params.value).forEach(([key, param]) => {
      urlParams.set(key, param.value.toString())
    })

    return `${baseUrl}?${urlParams.toString()}`
  })

  // Actions
  function setYear(year: number) {
    calculatorStore.setYear(year)
  }

  function updateParam(paramName: string, value: any) {
    calculatorStore.updateParam(paramName as any, value)
  }

  function resetParams() {
    calculatorStore.resetParams()
  }

  function saveCurrentState(name: string) {
    savedStatesStore.saveState(name, selectedYear.value, params.value)
  }

  function loadSavedState(name: string) {
    const state = savedStatesStore.loadState(name)
    if (state) {
      // Set year first
      calculatorStore.setYear(state.year)
      // Then restore all params
      Object.entries(state.params).forEach(([key, param]) => {
        calculatorStore.updateParam(key as any, param.value)
      })
    }
  }

  function deleteSavedState(name: string) {
    savedStatesStore.deleteState(name)
  }

  function copyShareableUrl() {
    navigator.clipboard.writeText(shareableUrl.value)
  }

  return {
    // State
    selectedYear,
    params,
    yearConfig,
    availableFeatures,
    result,
    shareableUrl,
    savedStates: computed(() => savedStatesStore.savedStates),
    currentStateName: computed(() => savedStatesStore.currentStateName),
    // Actions
    setYear,
    updateParam,
    resetParams,
    saveCurrentState,
    loadSavedState,
    deleteSavedState,
    copyShareableUrl
  }
}
