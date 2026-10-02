import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSavedStatesStore } from '../savedStates'

const validState = {
  name: 'Scenario 1',
  year: 2018,
  savedAt: 1700000000000,
  params: { ca: { name: 'C.A', min: 0, max: 200000, step: 500, value: 50000 } }
}

describe('Saved States Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('imports a valid export', () => {
    const store = useSavedStatesStore()
    expect(store.importStates(JSON.stringify([validState]))).toBe(true)
    expect(store.savedStates).toHaveLength(1)
    expect(store.savedStates[0].name).toBe('Scenario 1')
  })

  it('round-trips through export and import', () => {
    const store = useSavedStatesStore()
    store.importStates(JSON.stringify([validState]))
    const exported = store.exportStates()

    setActivePinia(createPinia())
    const other = useSavedStatesStore()
    expect(other.importStates(exported)).toBe(true)
    expect(other.savedStates).toEqual(store.savedStates)
  })

  it.each([
    ['invalid JSON', '{not json'],
    ['a non-array', JSON.stringify(validState)],
    ['an entry without params', JSON.stringify([{ ...validState, params: undefined }])],
    ['an entry with a malformed param', JSON.stringify([{ ...validState, params: { ca: 5 } }])],
    ['an entry without a name', JSON.stringify([{ ...validState, name: 42 }])],
    ['a null entry', JSON.stringify([null])]
  ])('rejects %s and keeps existing states', (_label, payload) => {
    const store = useSavedStatesStore()
    store.importStates(JSON.stringify([validState]))

    expect(store.importStates(payload)).toBe(false)
    expect(store.savedStates).toHaveLength(1)
  })
})
