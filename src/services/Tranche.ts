/**
 * Tax Bracket (Tranche) utility class
 * Used for both income tax (IR) and corporate tax (IS) calculations
 */
export default class Tranche {
  constructor(
    private min: number,
    private max: number | null,
    private taux: number
  ) {}

  getMin(): number {
    return this.min
  }

  getMax(): number | null {
    return this.max
  }

  getTaux(): number {
    return this.taux
  }

  getImpot(revenu: number): number {
    return this.compute(revenu)
  }

  compute(revenu: number): number {
    if (revenu < this.min) {
      return 0
    }
    if (this.max !== null && revenu > this.max) {
      return (this.max - this.min) * this.taux
    }
    return (revenu - this.min) * this.taux
  }
}
