import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CalculatorState } from '@/types/calculator.types'
import type { YearConfig } from '@/types/year-config.types'
import { getYearConfig, getDefaultYearConfig } from '@/config/years'
import ExerciceCalculator from '@/services/ExerciceCalculator'
import type { ExerciceParams, ExerciceResult } from '@/services/ExerciceCalculator'

export const useCalculatorStore = defineStore('calculator', () => {
  // State
  const selectedYear = ref<number>(getDefaultYearConfig().year)

  const params = ref<CalculatorState['params']>({
    capital: { name: 'Capital', min: 0, max: 100000, step: 100, value: 0 },
    charges: { name: 'Charges', min: 0, max: 100000, step: 500, value: 0 },
    ca: { name: 'C.A', min: 0, max: 200000, step: 500, value: 0 },
    nbMois: { name: 'Nb Mois', min: 0.25, max: 12, step: 0.25, value: 12 },
    remuneration: { name: 'Rémunération', min: 0, max: 150000, step: 500, value: 0 },
    dividendes: { name: 'Dividendes', min: 0, max: 150000, step: 500, value: 0 },
    autresRevenus: { name: 'Autres Revenus', min: 0, max: 50000, step: 500, value: 0 },
    bnc: { name: 'BNC', min: 0, max: 70000, step: 500, value: 0 },
    nbParts: { name: 'Nb Parts', min: 1, max: 10, step: 0.5, value: 1 },
    accre: { name: 'ACCRE', notSlider: true as const, value: 0, min: 0, max: 1, step: 1 },
    pfu: { name: 'Flat-Tax', notSlider: true as const, value: 0, min: 0, max: 1, step: 1 },
    zfu: { name: 'ZFU', notSlider: true as const, value: 0, min: 0, max: 1, step: 1 },
    forme: { name: 'Forme', notSlider: true as const, value: 'SASU', min: 0, max: 0, step: 0 },
    caisseRetraite: {
      name: 'Retraite',
      notSlider: true as const,
      value: 'CIPAV',
      min: 0,
      max: 0,
      step: 0
    }
  })

  // Getters
  const yearConfig = computed<YearConfig | undefined>(() => {
    return getYearConfig(selectedYear.value)
  })

  const availableFeatures = computed(() => {
    return yearConfig.value?.features
  })

  const calculationParams = computed<ExerciceParams>(() => {
    return {
      capital: params.value.capital.value,
      ca: params.value.ca.value,
      charges: params.value.charges.value,
      remuneration: params.value.remuneration.value,
      dividendes: params.value.dividendes.value,
      accre: Boolean(params.value.accre.value),
      pfu: Boolean(params.value.pfu.value),
      zfu: Boolean(params.value.zfu.value),
      autresRevenus: params.value.autresRevenus.value,
      bnc: params.value.bnc.value,
      nbParts: params.value.nbParts.value,
      nbMois: params.value.nbMois.value,
      forme: params.value.forme.value as 'EURL' | 'SASU',
      caisseRetraite: params.value.caisseRetraite.value as 'CIPAV' | 'SSI'
    }
  })

  const calculationResult = computed<ExerciceResult | null>(() => {
    try {
      const calculator = new ExerciceCalculator()
      return calculator.calculate(calculationParams.value)
    } catch (error) {
      console.error('Calculation error:', error)
      return null
    }
  })

  // Actions
  function setYear(year: number) {
    selectedYear.value = year
    const config = getYearConfig(year)
    if (config) {
      // Update default form based on year
      params.value.forme.value = config.defaultForm
      params.value.caisseRetraite.value = config.defaultPensionFund

      // Disable features not available for this year
      if (!config.features.hasFlatTax) {
        params.value.pfu.value = 0
      }
      if (!config.features.hasZfuExemption) {
        params.value.zfu.value = 0
      }
    }
  }

  function updateParam(
    paramName: keyof CalculatorState['params'],
    value: number | string | 0 | 1
  ) {
    const param = params.value[paramName]
    if (param) {
      // Type-safe assignment based on parameter type
      if ('notSlider' in param && param.notSlider) {
        // String or checkbox parameter
        ;(param as any).value = value
      } else {
        // Numeric parameter
        ;(param as any).value = value
      }
    }

    // Auto-disable PFU if not SASU
    if (paramName === 'forme' && value !== 'SASU') {
      params.value.pfu.value = 0
    }
  }

  function resetParams() {
    // Reset numeric values to 0
    params.value.capital.value = 0
    params.value.charges.value = 0
    params.value.ca.value = 0
    params.value.nbMois.value = 12
    params.value.remuneration.value = 0
    params.value.dividendes.value = 0
    params.value.autresRevenus.value = 0
    params.value.bnc.value = 0
    params.value.nbParts.value = 1

    // Reset checkboxes
    params.value.accre.value = 0
    params.value.pfu.value = 0
    params.value.zfu.value = 0

    // Reset to default year config
    const config = getYearConfig(selectedYear.value)
    if (config) {
      params.value.forme.value = config.defaultForm
      params.value.caisseRetraite.value = config.defaultPensionFund
    }
  }

  return {
    // State
    selectedYear,
    params,
    // Getters
    yearConfig,
    availableFeatures,
    calculationParams,
    calculationResult,
    // Actions
    setYear,
    updateParam,
    resetParams
  }
})
