import { describe, it, expect } from 'vitest'
import ImpotRevenu from '../ImpotRevenu'

describe('ImpotRevenu', () => {
  describe('2018 configuration', () => {
    it('should compute IR correctly for 75000€ with 2 parts', () => {
      const impotRevenu = new ImpotRevenu()
      impotRevenu.revenu = 75000
      impotRevenu.nbParts = 2
      // Revenue per part: 75000 / 2 = 37500
      // Tranche 1: (9807 - 0) * 0 = 0
      // Tranche 2: (27086 - 9808) * 0.14 = 2418.92
      // Tranche 3: (37500 - 27087) * 0.3 = 3123.9
      // Per part: 5542.82
      // Total: 5542.82 * 2 = 11085.64
      expect(impotRevenu.getImpot()).toBeCloseTo(11085.64, 2)
    })

    it('should compute IR correctly for single person (1 part)', () => {
      const impotRevenu = new ImpotRevenu()
      impotRevenu.revenu = 50000
      impotRevenu.nbParts = 1
      // Tranche 1: 0
      // Tranche 2: (27086 - 9808) * 0.14 = 2418.92
      // Tranche 3: (50000 - 27087) * 0.3 = 6873.9
      // Total: 9292.82
      expect(impotRevenu.getImpot()).toBeCloseTo(9292.82, 2)
    })

    it('should handle low income with no tax', () => {
      const impotRevenu = new ImpotRevenu()
      impotRevenu.revenu = 8000
      impotRevenu.nbParts = 1
      expect(impotRevenu.getImpot()).toBe(0)
    })
  })

  describe('getTranches', () => {
    it('should return correct tranches breakdown', () => {
      const impotRevenu = new ImpotRevenu()
      impotRevenu.revenu = 75000
      impotRevenu.nbParts = 2
      const tranches = impotRevenu.getTranches()

      expect(tranches).toHaveLength(5)
      expect(tranches[0].taux).toBe(0) // 0%
      expect(tranches[1].taux).toBe(0.14) // 14%
      expect(tranches[2].taux).toBe(0.3) // 30%
      expect(tranches[3].taux).toBe(0.41) // 41%
      expect(tranches[4].taux).toBe(0.45) // 45%
    })
  })
})
