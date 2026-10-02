import { describe, it, expect } from 'vitest'
import ExerciceCalculator from '../ExerciceCalculator'
import type { ExerciceParams } from '../ExerciceCalculator'
import ImpotRevenu from '../ImpotRevenu'
import ImpotSociete from '../ImpotSociete'
import { year2017 } from '@/config/years/year2017'
import { year2018 } from '@/config/years/year2018'

/**
 * Regression tests for bugs found during the audit.
 * Each block pins an exact expected value so a regression cannot hide
 * behind "greater than 0" style assertions.
 */

const baseParams: ExerciceParams = {
  capital: 1000,
  ca: 80000,
  charges: 5000,
  remuneration: 30000,
  dividendes: 10000,
  accre: false,
  pfu: false,
  zfu: false,
  autresRevenus: 0,
  bnc: 0,
  nbParts: 1,
  nbMois: 12,
  forme: 'SASU',
  caisseRetraite: 'CIPAV'
}

describe('ExerciceCalculator - regressions', () => {
  describe('year configuration is applied', () => {
    it('defaults to the 2018 configuration', () => {
      const withDefault = new ExerciceCalculator().calculate(baseParams)
      const with2018 = new ExerciceCalculator(year2018).calculate(baseParams)
      expect(withDefault).toEqual(with2018)
    })

    it('uses the 2017 SASU salary contribution rate (89%)', () => {
      const result = new ExerciceCalculator(year2017).calculate(baseParams)
      expect(result.remuneration.cotisationsSociales).toBeCloseTo(30000 * 0.89, 2)
    })

    it('uses the 2018 SASU salary contribution rate (81.85%)', () => {
      const result = new ExerciceCalculator(year2018).calculate(baseParams)
      expect(result.remuneration.cotisationsSociales).toBeCloseTo(30000 * 0.8185, 2)
    })

    it('uses the 2017 social levy on dividends (15.5%)', () => {
      const result = new ExerciceCalculator(year2017).calculate(baseParams)
      expect(result.dividendes.cotisationsSociales).toBeCloseTo(1550, 2)
    })

    it('ignores the flat tax in 2017 (introduced in 2018)', () => {
      const result = new ExerciceCalculator(year2017).calculate({ ...baseParams, pfu: true })
      expect(result.IR.impotPFU).toBe(0)
      expect(result.dividendes.assietteIR).toBeGreaterThan(0)
    })

    it('ignores the ZFU exemption in 2017', () => {
      const result = new ExerciceCalculator(year2017).calculate({ ...baseParams, zfu: true })
      expect(result.IS.exonerations).toBe(0)
      expect(result.IS.impot).toBeGreaterThan(0)
    })
  })

  describe('tax brackets', () => {
    it('computes 2017 IR with contiguous brackets (official formula)', () => {
      const impotRevenu = new ImpotRevenu({ tranches: year2017.taxBrackets.ir })
      impotRevenu.revenu = 75000
      impotRevenu.nbParts = 2
      // 37500 per part: 37500 * 0.30 - 5650.28 = 5599.72, x2
      expect(impotRevenu.getImpot()).toBeCloseTo(11199.44, 2)
    })

    it('computes 2018 IR with contiguous brackets (official formula)', () => {
      const impotRevenu = new ImpotRevenu({ tranches: year2018.taxBrackets.ir })
      impotRevenu.revenu = 20000
      impotRevenu.nbParts = 1
      // 20000 * 0.14 - 1372.98
      expect(impotRevenu.getImpot()).toBeCloseTo(1427.02, 2)
    })

    it.each([year2017, year2018])('has contiguous IR and IS brackets ($year)', (config) => {
      for (const brackets of [config.taxBrackets.ir, config.taxBrackets.is]) {
        brackets.slice(1).forEach((bracket, i) => {
          expect(bracket.min).toBe(brackets[i].max)
        })
      }
    })

    it('computes 2017 IS with the 28% rate up to 75,000€', () => {
      const impotSociete = new ImpotSociete({ tranches: year2017.taxBrackets.is })
      impotSociete.benefice = 95000
      // 38120 * 0.15 + (75000 - 38120) * 0.28 + (95000 - 75000) * 0.333
      expect(impotSociete.getImpot()).toBeCloseTo(22704.4, 2)
    })
  })

  describe('EURL dividends', () => {
    it('does not produce negative contributions when dividends are below 10% of capital', () => {
      const result = new ExerciceCalculator().calculate({
        ...baseParams,
        forme: 'EURL',
        capital: 100000,
        dividendes: 5000
      })

      expect(result.dividendes.dividendes10?.brut).toBe(5000)
      expect(result.dividendes.dividendes90?.brut).toBe(0)
      expect(result.dividendes.cotisationsSociales).toBeCloseTo(5000 * 0.172, 2)
      expect(result.dividendes.net).toBeCloseTo(5000 * (1 - 0.172), 2)
    })

    it.each([
      ['EURL', 0, 1000],
      ['EURL', 100000, 1000],
      ['EURL', 100000, 20000],
      ['SASU', 100000, 1000]
    ] as const)('%s with capital %i and dividends %i never nets more than gross', (forme, capital, dividendes) => {
      const result = new ExerciceCalculator().calculate({ ...baseParams, forme, capital, dividendes })
      expect(result.dividendes.net).toBeLessThanOrEqual(result.dividendes.brut)
      expect(result.dividendes.cotisationsSociales).toBeGreaterThanOrEqual(0)
    })
  })

  describe('SASU ACCRE', () => {
    it('applies the reduced rate below 75% of the current year PASS', () => {
      // 0.75 * 39732 = 29799; the old hardcoded 2017 threshold was 29421
      const result = new ExerciceCalculator(year2018).calculate({
        ...baseParams,
        remuneration: 29500,
        accre: true
      })
      expect(result.remuneration.cotisationsSociales).toBeCloseTo(29500 * 0.35, 2)
    })
  })
})

describe('Flat tax (PFU)', () => {
  const result = new ExerciceCalculator(year2018).calculate({ ...baseParams, pfu: true })

  it('splits IR between progressive scale and flat tax', () => {
    expect(result.IR.impotPFU).toBeCloseTo(10000 * 0.128, 2)
    expect(result.IR.impot).toBeCloseTo(result.IR.impotBareme + result.IR.impotPFU, 2)
  })

  it('deducts the flat tax only once from the net income', () => {
    expect(result.net).toBeCloseTo(
      result.remuneration.net + result.dividendes.net - result.IR.impotBareme,
      2
    )
    expect(result.net).toBeCloseTo(34592.98, 2)
  })
})

describe('CSG/CRDS', () => {
  const eurl = new ExerciceCalculator(year2018).calculate({
    ...baseParams,
    forme: 'EURL',
    dividendes: 0
  })
  const cs = eurl.remuneration.cs!

  it('splits EURL CSG/CRDS into 6.8% deductible and 2.9% non-deductible', () => {
    expect(cs.getCsgCrdsDeductible()).toBeCloseTo((cs.getAssietteCsgCrds() * 6.8) / 100, 2)
    expect(cs.getCsgCrdsNonDeductible()).toBeCloseTo((cs.getAssietteCsgCrds() * 2.9) / 100, 2)
  })

  it('adds the non-deductible CSG/CRDS to the EURL manager taxable income', () => {
    const expected = (30000 + cs.getCsgCrdsNonDeductible()) * 0.9
    expect(eurl.remuneration.assietteIR).toBeCloseTo(expected, 2)
    expect(eurl.IR.assiette).toBeCloseTo(expected, 2)
  })

  it('deducts 6.8% CSG from 2018 dividends taxed at the progressive scale', () => {
    const sasu = new ExerciceCalculator(year2018).calculate(baseParams)
    // 10000 * (1 - 40%) - 10000 * 6.8%
    expect(sasu.dividendes.assietteIR).toBeCloseTo(5320, 2)
  })

  it('still deducts 5.1% CSG from 2017 dividends', () => {
    const sasu = new ExerciceCalculator(year2017).calculate(baseParams)
    expect(sasu.dividendes.assietteIR).toBeCloseTo(5490, 2)
  })
})

describe('EURL ACCRE (2018)', () => {
  const PASS = year2018.pass
  const eurl = (remuneration: number, accre: boolean, caisseRetraite: 'CIPAV' | 'SSI' = 'SSI') =>
    new ExerciceCalculator(year2018).calculate({
      ...baseParams,
      forme: 'EURL',
      dividendes: 0,
      remuneration,
      accre,
      caisseRetraite
    })

  it.each(['CIPAV', 'SSI'] as const)(
    'waives health, family, basic pension and disability below 75%% of the PASS (%s)',
    (caisse) => {
      const cs = eurl(20000, true, caisse).remuneration.cs!
      expect(cs.getTauxExonerationAccre()).toBe(1)
      expect(cs.getExonerationAccre()).toBeCloseTo(
        cs.getMaladie() +
          cs.getAllocationsFamiliales() +
          cs.caisseRetraite.getRetraiteBase() +
          cs.caisseRetraite.getInvaliditeDeces(),
        2
      )
    }
  )

  it('keeps CSG/CRDS, supplementary pension, training and daily allowances due', () => {
    const result = eurl(20000, true)
    const cs = result.remuneration.cs!
    expect(result.remuneration.cotisationsSociales).toBeCloseTo(
      cs.getMaladie2() +
        cs.getFormationProfessionnelle() +
        cs.caisseRetraite.getRetraiteComplementaire() +
        cs.getCsgCrds(),
      2
    )
  })

  it('does not add waived contributions to the CSG/CRDS base', () => {
    const cs = eurl(20000, true).remuneration.cs!
    expect(cs.getAssietteCsgCrds()).toBeCloseTo(
      20000 + cs.getMaladie2() + cs.caisseRetraite.getRetraiteComplementaire(),
      2
    )
  })

  it('halves the exemption at 87.5% of the PASS', () => {
    const cs = eurl(PASS * 0.875, true).remuneration.cs!
    expect(cs.getTauxExonerationAccre()).toBeCloseTo(0.5, 6)
  })

  it('is continuous at 75% of the PASS', () => {
    const below = eurl(PASS * 0.75, true).remuneration.cotisationsSociales
    const above = eurl(PASS * 0.75 + 1, true).remuneration.cotisationsSociales
    expect(Math.abs(above - below)).toBeLessThan(5)
  })

  it.each([PASS, 60000])('has no effect at or above the PASS (%d€)', (remuneration) => {
    expect(eurl(remuneration, true).remuneration.cotisationsSociales).toBeCloseTo(
      eurl(remuneration, false).remuneration.cotisationsSociales,
      2
    )
  })

  it('has no effect when ACCRE is not selected', () => {
    expect(eurl(20000, false).remuneration.cs!.getExonerationAccre()).toBe(0)
  })
})
