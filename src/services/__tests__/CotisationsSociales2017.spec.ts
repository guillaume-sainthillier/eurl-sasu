import { describe, expect, it } from 'vitest'
import { year2017 } from '@/config/years/year2017'
import { year2018 } from '@/config/years/year2018'
import CotisationsSociales2017 from '../CotisationsSociales2017'
import type { ExerciceParams } from '../ExerciceCalculator'
import ExerciceCalculator from '../ExerciceCalculator'
import Cipav2017 from '../pension-funds/Cipav2017'

function cotisations2017(remuneration: number, accre = false): CotisationsSociales2017 {
  const cs = new CotisationsSociales2017()
  cs.remuneration = remuneration
  cs.accre = accre
  cs.caisseRetraite = new Cipav2017(remuneration)
  return cs
}

describe('CotisationsSociales2017', () => {
  // Expected values from the original 2017 application test suite
  it('charges minimum contributions without income', () => {
    expect(cotisations2017(0).getCotisations()).toBeCloseTo(2238.91, 2)
  })

  it('computes contributions for 20,000€', () => {
    expect(cotisations2017(20000).getCotisations()).toBeCloseTo(7405.07, 2)
  })

  it('waives health, family, pension and disability contributions with ACCRE', () => {
    const cs = cotisations2017(20000, true)
    // Only professional training (39228 * 0.25%) and CSG/CRDS (20000 * 8%) remain
    expect(cs.getCotisations()).toBeCloseTo(98.07 + 1600, 2)
    expect(cs.getExonerationAccre()).toBeGreaterThan(0)
  })

  it('does not apply ACCRE above 28,962€', () => {
    expect(cotisations2017(30000, true).getCotisations()).toBeCloseTo(
      cotisations2017(30000).getCotisations(),
      2
    )
  })

  it('splits CSG/CRDS into 5.1% deductible and 2.9% non-deductible', () => {
    const cs = cotisations2017(20000)
    expect(cs.getCsgCrds()).toBeCloseTo(cs.getAssietteCsgCrds() * 0.08, 2)
    expect(cs.getCsgCrdsDeductible()).toBeCloseTo(cs.getAssietteCsgCrds() * 0.051, 2)
  })

  it.each([
    [1.1, 2.15],
    [1.25, 3.7],
    [1.4, 5.25]
  ])('computes family allowances at %f PASS (rate %f%%)', (ratio, taux) => {
    // The original returned NaN exactly on the 110% and 140% boundaries
    const cs = cotisations2017(39228 * ratio)
    expect(cs.getTauxAllocationsFamiliales()).toBeCloseTo(taux, 4)
    expect(Number.isFinite(cs.getCotisations())).toBe(true)
  })
})

describe('ExerciceCalculator - 2017 EURL', () => {
  const params: ExerciceParams = {
    capital: 1000,
    ca: 60000,
    charges: 5000,
    remuneration: 20000,
    dividendes: 0,
    accre: false,
    pfu: false,
    zfu: false,
    autresRevenus: 0,
    bnc: 0,
    nbParts: 1,
    nbMois: 12,
    forme: 'EURL',
    caisseRetraite: 'CIPAV'
  }

  it('uses the 2017 contribution model', () => {
    const result = new ExerciceCalculator(year2017).calculate(params)
    expect(result.remuneration.cotisationsSociales).toBeCloseTo(7405.07, 2)
  })

  it('always uses CIPAV in 2017 (no pension fund selection)', () => {
    const cipav = new ExerciceCalculator(year2017).calculate(params)
    const ssi = new ExerciceCalculator(year2017).calculate({ ...params, caisseRetraite: 'SSI' })
    expect(ssi.remuneration.cotisationsSociales).toBe(cipav.remuneration.cotisationsSociales)
  })

  it('differs from the 2018 model', () => {
    const result2017 = new ExerciceCalculator(year2017).calculate(params)
    const result2018 = new ExerciceCalculator(year2018).calculate(params)
    expect(result2017.remuneration.cotisationsSociales).not.toBeCloseTo(
      result2018.remuneration.cotisationsSociales,
      0
    )
  })

  it('applies the 2017 ACCRE', () => {
    const result = new ExerciceCalculator(year2017).calculate({ ...params, accre: true })
    expect(result.remuneration.cotisationsSociales).toBeCloseTo(98.07 + 1600, 2)
  })
})
