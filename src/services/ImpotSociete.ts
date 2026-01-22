import Tranche from './Tranche'

export interface ImpotSocieteConfig {
  tranches: Array<{ min: number; max: number | null; taux: number }>
  prorata?: number
}

/**
 * Corporate Tax (Impôt sur les Sociétés - IS) Calculator
 * Calculates tax on company profits based on progressive brackets
 */
export default class ImpotSociete {
  public benefice: number = 0
  public prorata: number = 1
  private config: ImpotSocieteConfig

  constructor(config?: ImpotSocieteConfig) {
    // Default 2018 configuration if not provided
    this.config = config || {
      tranches: [
        { min: 0, max: 38120, taux: 0.15 },
        { min: 38120, max: 500000, taux: 0.28 },
        { min: 500000, max: null, taux: 0.33 }
      ]
    }

    if (config?.prorata !== undefined) {
      this.prorata = config.prorata
    }
  }

  getBaseTranches(): Tranche[] {
    return this.config.tranches.map(
      (t) => new Tranche(
        t.min === 0 ? 0 : t.min * this.prorata,
        t.max === null ? null : t.max * this.prorata,
        t.taux
      )
    )
  }

  getImpot(): number {
    let total = 0
    this.getBaseTranches().forEach((tranche) => {
      total += tranche.getImpot(this.benefice)
    })
    return total
  }

  getTranches() {
    const tranches: Array<{
      value: number
      min: number
      max: number | null
      taux: number
    }> = []

    this.getBaseTranches().forEach((tranche) => {
      tranches.push({
        value: tranche.getImpot(this.benefice),
        min: tranche.getMin(),
        max: tranche.getMax(),
        taux: tranche.getTaux()
      })
    })

    return tranches
  }
}
