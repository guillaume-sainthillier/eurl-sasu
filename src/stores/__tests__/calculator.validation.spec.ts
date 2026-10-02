import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCalculatorStore } from '../calculator'

describe('Calculator Store - input validation', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('changes the result when the year changes', () => {
    const store = useCalculatorStore()
    store.updateParam('ca', 80000)
    store.updateParam('remuneration', 30000)
    store.updateParam('dividendes', 10000)

    store.setYear(2018)
    const result2018 = store.calculationResult!
    store.setYear(2017)
    store.updateParam('forme', 'SASU')
    const result2017 = store.calculationResult!

    expect(result2017.remuneration.cotisationsSociales).not.toBe(
      result2018.remuneration.cotisationsSociales
    )
    expect(result2017.IR.impot).not.toBe(result2018.IR.impot)
  })

  it('ignores unknown years', () => {
    const store = useCalculatorStore()
    store.setYear(2019)
    expect(store.selectedYear).toBe(2018)
    expect(store.yearConfig).toBeDefined()
  })

  it('ignores a cleared number input instead of corrupting the result', () => {
    const store = useCalculatorStore()
    store.updateParam('autresRevenus', 1000)
    store.updateParam('autresRevenus', '')

    expect(store.params.autresRevenus.value).toBe(1000)
    expect(typeof store.calculationResult?.net).toBe('number')
    expect(Number.isFinite(store.calculationResult?.net)).toBe(true)
  })

  it('ignores NaN values', () => {
    const store = useCalculatorStore()
    store.updateParam('ca', NaN)
    expect(store.params.ca.value).toBe(0)
  })

  it.each([
    ['nbParts', 0, 1],
    ['nbMois', 0, 0.25],
    ['ca', -5000, 0]
  ] as const)('clamps %s=%d to its minimum %d', (name, value, expected) => {
    const store = useCalculatorStore()
    store.updateParam(name, value)
    expect(store.params[name].value).toBe(expected)
    expect(Number.isFinite(store.calculationResult?.net)).toBe(true)
  })

  it('allows values above the slider maximum (typed in the number input)', () => {
    const store = useCalculatorStore()
    store.updateParam('ca', 500000)
    expect(store.params.ca.value).toBe(500000)
  })

  it('rejects unknown company forms and pension funds', () => {
    const store = useCalculatorStore()
    store.updateParam('forme', 'SARL')
    store.updateParam('caisseRetraite', 'MSA')
    expect(store.params.forme.value).toBe('SASU')
    expect(store.params.caisseRetraite.value).toBe('CIPAV')
  })

  it('normalizes checkbox values to 0 or 1', () => {
    const store = useCalculatorStore()
    store.updateParam('accre', 5)
    expect(store.params.accre.value).toBe(1)
    store.updateParam('accre', 0)
    expect(store.params.accre.value).toBe(0)
  })
})
