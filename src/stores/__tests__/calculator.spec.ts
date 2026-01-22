import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCalculatorStore } from '../calculator'

describe('Calculator Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default year (2018)', () => {
    const store = useCalculatorStore()
    expect(store.selectedYear).toBe(2018)
  })

  it('should have correct year config', () => {
    const store = useCalculatorStore()
    expect(store.yearConfig).toBeDefined()
    expect(store.yearConfig?.year).toBe(2018)
    expect(store.yearConfig?.pass).toBe(39732)
  })

  it('should update year when setYear is called', () => {
    const store = useCalculatorStore()
    store.setYear(2017)
    expect(store.selectedYear).toBe(2017)
    expect(store.yearConfig?.year).toBe(2017)
    expect(store.yearConfig?.pass).toBe(39228)
  })

  it('should update param values', () => {
    const store = useCalculatorStore()
    store.updateParam('ca', 100000)
    expect(store.params.ca.value).toBe(100000)
  })

  it('should auto-disable PFU when switching from SASU to EURL', () => {
    const store = useCalculatorStore()
    store.params.forme.value = 'SASU' as any
    store.params.pfu.value = 1

    store.updateParam('forme', 'EURL')
    expect(store.params.pfu.value).toBe(0)
  })

  it('should reset all params', () => {
    const store = useCalculatorStore()
    store.updateParam('ca', 100000)
    store.updateParam('remuneration', 50000)

    store.resetParams()
    expect(store.params.ca.value).toBe(0)
    expect(store.params.remuneration.value).toBe(0)
  })

  it('should have available features from year config', () => {
    const store = useCalculatorStore()
    expect(store.availableFeatures).toBeDefined()
    expect(store.availableFeatures?.hasFlatTax).toBe(true) // 2018
    expect(store.availableFeatures?.hasPensionFundSelection).toBe(true)
  })

  it('should calculate result when params are set', () => {
    const store = useCalculatorStore()
    store.updateParam('ca', 100000)
    store.updateParam('charges', 10000)
    store.updateParam('remuneration', 40000)

    expect(store.calculationResult).toBeDefined()
    expect(store.calculationResult?.societe.ca).toBe(100000)
    expect(store.calculationResult?.societe.charges).toBe(10000)
  })
})
