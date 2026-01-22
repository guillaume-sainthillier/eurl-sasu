import { describe, it, expect } from 'vitest'
import ImpotSociete from '../ImpotSociete'

describe('ImpotSociete', () => {
  describe('2018 configuration', () => {
    it('should compute IS correctly for 95000€ benefice', () => {
      const impotSociete = new ImpotSociete()
      impotSociete.benefice = 95000
      // IS calculation:
      // Tranche 1: 38120 * 0.15 = 5718
      // Tranche 2: (95000 - 38120) * 0.28 = 15926.4
      // Total: 21644.4
      expect(impotSociete.getImpot()).toBeCloseTo(21644.4, 2)
    })

    it('should compute IS correctly for small benefice (20000€)', () => {
      const impotSociete = new ImpotSociete()
      impotSociete.benefice = 20000
      // All in first bracket: 20000 * 0.15 = 3000
      expect(impotSociete.getImpot()).toBeCloseTo(3000, 2)
    })

    it('should handle prorata correctly (6 months)', () => {
      const impotSociete = new ImpotSociete()
      impotSociete.benefice = 40000
      impotSociete.prorata = 0.5 // 6 months
      // First bracket is prorated: 38120 * 0.5 = 19060
      // Tranche 1: 19060 * 0.15 = 2859
      // Tranche 2: (40000 - 19060) * 0.28 = 5863.2
      // Total: 8722.2
      expect(impotSociete.getImpot()).toBeCloseTo(8722.2, 2)
    })
  })

  describe('getTranches', () => {
    it('should return correct tranches breakdown', () => {
      const impotSociete = new ImpotSociete()
      impotSociete.benefice = 95000
      const tranches = impotSociete.getTranches()

      expect(tranches).toHaveLength(3)
      expect(tranches[0].taux).toBe(0.15)
      expect(tranches[1].taux).toBe(0.28)
      expect(tranches[2].taux).toBe(0.33)
    })
  })
})
