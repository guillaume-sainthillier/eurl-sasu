import { computed } from 'vue'
import { useCalculatorStore } from '@/stores/calculator'
import type { CalculatorState } from '@/types/calculator.types'

/**
 * Composable for calculator functionality
 * Provides easy access to calculator state and actions
 */
export function useCalculation() {
    const calculatorStore = useCalculatorStore()

    // Calculator state
    const selectedYear = computed(() => calculatorStore.selectedYear)
    const params = computed(() => calculatorStore.params)
    const yearConfig = computed(() => calculatorStore.yearConfig)
    const availableFeatures = computed(() => calculatorStore.availableFeatures)
    const result = computed(() => calculatorStore.calculationResult)

    // Actions
    function setYear(year: number) {
        calculatorStore.setYear(year)
    }

    function updateParam(paramName: string, value: number | string) {
        calculatorStore.updateParam(paramName as keyof CalculatorState['params'], value)
    }

    return {
        // State
        selectedYear,
        params,
        yearConfig,
        availableFeatures,
        result,
        // Actions
        setYear,
        updateParam,
    }
}
