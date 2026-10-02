import type { PensionFundBase } from './PensionFundBase'

/**
 * CIPAV Pension Fund Calculator - 2017 rules
 * Ported from the original 2017 application
 * Source: https://www.lacipav.fr/
 */
export default class Cipav2017 implements PensionFundBase {
  PASS: number = 39228
  revenus: number

  constructor(revenus: number, pass?: number) {
    this.revenus = revenus
    if (pass !== undefined) {
      this.PASS = pass
    }
  }

  // RETRAITE DE BASE
  getRetraiteBase(): number {
    // Minimum contribution below 4,441€
    if (this.revenus < 4441) {
      return 448
    }

    // 8.23% up to 1 PASS + 1.87% on the whole income
    return (Math.min(this.PASS, this.revenus) * 8.23 + this.revenus * 1.87) / 100
  }

  getAssietteRetraiteBase(): number {
    return this.revenus
  }

  getTauxRetraiteBase(): number | null {
    if (this.revenus < 4441) {
      return null
    }

    return (this.getRetraiteBase() / this.getAssietteRetraiteBase()) * 100
  }

  // RETRAITE COMPLÉMENTAIRE
  getRetraiteComplementaire(): number {
    // Flat amount per income class
    if (this.revenus <= 26580) {
      return 1277
    }
    if (this.revenus <= 49280) {
      return 2553
    }
    if (this.revenus <= 57850) {
      return 3830
    }
    if (this.revenus <= 66400) {
      return 6384
    }
    if (this.revenus <= 83060) {
      return 8937
    }
    if (this.revenus <= 103180) {
      return 14044
    }
    if (this.revenus <= 123300) {
      return 15320
    }
    return 16597
  }

  getTauxRetraiteComplementaire(): number | null {
    return null
  }

  // INVALIDITÉ DÉCÈS
  getInvaliditeDeces(): number {
    // Class C
    return 380
  }

  getTauxInvaliditeDeces(): number | null {
    return null
  }

  getAssietteInvaliditeDeces(): number | null {
    return null
  }
}
