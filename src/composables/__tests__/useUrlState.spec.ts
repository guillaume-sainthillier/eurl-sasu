import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useCalculatorStore } from '@/stores/calculator'
import { useUrlState } from '../useUrlState'

function setSearch(search: string) {
  window.history.replaceState({}, '', `/${search}`)
}

describe('useUrlState', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    setSearch('')
  })

  it('restores a state encoded by encodeStateToUrl', () => {
    const store = useCalculatorStore()
    const { encodeStateToUrl } = useUrlState()
    store.setYear(2017)
    store.updateParam('forme', 'EURL')
    store.updateParam('caisseRetraite', 'SSI')
    store.updateParam('ca', 75000)
    store.updateParam('nbParts', 2.5)
    store.updateParam('accre', 1)
    const expectedParams = JSON.parse(JSON.stringify(store.params))

    setSearch(new URL(encodeStateToUrl()).search)
    setActivePinia(createPinia())
    const fresh = useCalculatorStore()
    useUrlState().loadStateFromUrl()

    expect(fresh.selectedYear).toBe(2017)
    expect(fresh.params).toEqual(expectedParams)
  })

  it('ignores malformed or out-of-range values from a crafted URL', () => {
    setSearch('?year=2019&nbParts=0&nbMois=0&ca=abc&forme=SARL&remuneration=30000')
    const store = useCalculatorStore()
    useUrlState().loadStateFromUrl()

    expect(store.selectedYear).toBe(2018)
    expect(store.params.nbParts.value).toBe(1)
    expect(store.params.nbMois.value).toBe(0.25)
    expect(store.params.ca.value).toBe(0)
    expect(store.params.forme.value).toBe('SASU')
    expect(store.params.remuneration.value).toBe(30000)
    expect(Number.isFinite(store.calculationResult?.net)).toBe(true)
  })
})
