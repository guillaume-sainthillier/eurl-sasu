import Tranche from './Tranche'

export interface ImpotRevenuConfig {
  tranches: Array<{ min: number; max: number | null; taux: number }>
}

/**
 * Income Tax (Impôt sur le Revenu - IR) Calculator
 * Calculates personal income tax based on progressive brackets and household parts (nbParts)
 */
export default class ImpotRevenu {
  public revenu: number = 0
  public nbParts: number = 1
  private tranches: Tranche[]

  constructor(config?: ImpotRevenuConfig) {
    // Default 2018 configuration if not provided
    const defaultConfig: ImpotRevenuConfig = {
      tranches: [
        { min: 0, max: 9807, taux: 0 },
        { min: 9808, max: 27086, taux: 0.14 },
        { min: 27087, max: 72617, taux: 0.3 },
        { min: 72618, max: 153783, taux: 0.41 },
        { min: 153784, max: null, taux: 0.45 }
      ]
    }

    const cfg = config || defaultConfig
    this.tranches = cfg.tranches.map((t) => new Tranche(t.min, t.max, t.taux))
  }

  getImpot(): number {
    let total = 0
    this.tranches.forEach((tranche) => {
      total += tranche.getImpot(this.revenu / this.nbParts)
    })
    return total * this.nbParts
  }

  getTranches() {
    const tranches: Array<{
      value: number
      min: number
      max: number | null
      taux: number
    }> = []

    this.tranches.forEach((tranche) => {
      tranches.push({
        value: tranche.getImpot(this.revenu / this.nbParts) * this.nbParts,
        min: tranche.getMin(),
        max: tranche.getMax(),
        taux: tranche.getTaux()
      })
    })

    return tranches
  }
}
