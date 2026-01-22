import { describe, it, expect } from 'vitest'
import Tranche from '../Tranche'

describe('Tranche', () => {
  it('should compute tax for income within bracket', () => {
    const tranche = new Tranche(10000, 20000, 0.14)
    // Income 15000: (15000 - 10000) * 0.14 = 700
    expect(tranche.compute(15000)).toBeCloseTo(700, 2)
  })

  it('should return 0 for income below bracket', () => {
    const tranche = new Tranche(10000, 20000, 0.14)
    expect(tranche.compute(5000)).toBe(0)
  })

  it('should compute full bracket for income above max', () => {
    const tranche = new Tranche(10000, 20000, 0.14)
    // Income 25000: (20000 - 10000) * 0.14 = 1400
    expect(tranche.compute(25000)).toBeCloseTo(1400, 2)
  })

  it('should handle null max (unlimited bracket)', () => {
    const tranche = new Tranche(100000, null, 0.45)
    // Income 150000: (150000 - 100000) * 0.45 = 22500
    expect(tranche.compute(150000)).toBeCloseTo(22500, 2)
  })

  it('should provide getters', () => {
    const tranche = new Tranche(10000, 20000, 0.14)
    expect(tranche.getMin()).toBe(10000)
    expect(tranche.getMax()).toBe(20000)
    expect(tranche.getTaux()).toBe(0.14)
  })
})
