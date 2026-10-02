import { describe, expect, it } from 'vitest'
import ImpotRevenu from '../ImpotRevenu'

describe('ImpotRevenu', () => {
    describe('2018 configuration', () => {
        it('should compute IR correctly for 75000€ with 2 parts', () => {
            const impotRevenu = new ImpotRevenu()
            impotRevenu.revenu = 75000
            impotRevenu.nbParts = 2
            // Revenue per part: 75000 / 2 = 37500
            // Tranche 1: (9807 - 0) * 0 = 0
            // Tranche 2: (27086 - 9807) * 0.14 = 2419.06
            // Tranche 3: (37500 - 27086) * 0.3 = 3124.2
            // Per part: 5543.26
            // Total: 5543.26 * 2 = 11086.52
            expect(impotRevenu.getImpot()).toBeCloseTo(11086.52, 2)
        })

        it('should compute IR correctly for single person (1 part)', () => {
            const impotRevenu = new ImpotRevenu()
            impotRevenu.revenu = 50000
            impotRevenu.nbParts = 1
            // Tranche 1: 0
            // Tranche 2: (27086 - 9807) * 0.14 = 2419.06
            // Tranche 3: (50000 - 27086) * 0.3 = 6874.2
            // Total: 9293.26 (official formula: R * 0.30 - 5706.74)
            expect(impotRevenu.getImpot()).toBeCloseTo(9293.26, 2)
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
