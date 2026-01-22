import type { PensionFundBase } from './pension-funds/PensionFundBase'

/**
 * Social Contributions (Cotisations Sociales) Calculator for EURL
 * Calculates all mandatory social security contributions for self-employed workers
 * Source: https://www.urssaf.fr/
 */
export default class CotisationsSociales {
  remuneration: number = 0
  accre: boolean = false
  PASS: number = 39732
  caisseRetraite!: PensionFundBase

  _revenuPro(): number {
    return this.remuneration
  }

  _tauxProgressif(
    montantMin: number,
    tauxMin: number,
    montantMax: number,
    tauxMax: number,
    montant: number
  ): number {
    return tauxMin + ((tauxMax - tauxMin) * (montant - montantMin)) / (montantMax - montantMin)
  }

  // MALADIE
  getMaladie(): number {
    const taux = this.getTauxMaladie()
    const assiette = this.getAssietteMaladie()
    return (assiette * taux) / 100
  }

  getAssietteMaladie(): number {
    return Math.max((40 * this.PASS) / 100, this._revenuPro())
  }

  getTauxMaladie(): number {
    const assiette = this.getAssietteMaladie()

    // https://www.secu-independants.fr/cotisations/presentation-cotisations/liste-des-cotisations/
    if (assiette > (110 * this.PASS) / 100) {
      return 6.5
    }

    // Taux progressif : entre 1,50 % et 6,50 %
    const tauxMin = 1.5
    const tauxMax = 6.5
    const montantMin = (40 * this.PASS) / 100
    const montantMax = (110 * this.PASS) / 100

    return this._tauxProgressif(montantMin, tauxMin, montantMax, tauxMax, assiette)
  }

  // MALADIE 2
  getMaladie2(): number {
    const taux = this.getTauxMaladie2()
    const assiette = this.getAssietteMaladie2()
    return (assiette * taux) / 100
  }

  getAssietteMaladie2(): number {
    const revenuMinimal = Math.max((40 * this.PASS) / 100, this._revenuPro())
    return Math.min(5 * this.PASS, revenuMinimal)
  }

  getTauxMaladie2(): number {
    return 0.85
  }

  // ALLOCATIONS FAMILIALES
  getAllocationsFamiliales(): number {
    const taux = this.getTauxAllocationsFamiliales()
    const assiette = this.getAssietteAllocationsFamiliales()
    return (assiette * taux) / 100
  }

  getAssietteAllocationsFamiliales(): number {
    return this._revenuPro()
  }

  getTauxAllocationsFamiliales(): number {
    const assiette = this.getAssietteAllocationsFamiliales()
    if (assiette < (110 * this.PASS) / 100) {
      return 0
    }

    if (assiette > (140 * this.PASS) / 100) {
      return 3.1
    }

    // Taux progressif : entre 0 % et 3,10 %
    const tauxMin = 0
    const tauxMax = 3.1
    const montantMin = (110 * this.PASS) / 100
    const montantMax = (140 * this.PASS) / 100

    return this._tauxProgressif(montantMin, tauxMin, montantMax, tauxMax, assiette)
  }

  // FORMATION PRO
  getFormationProfessionnelle(): number {
    const taux = this.getTauxFormationProfessionnelle()
    const assiette = this.getAssietteFormationProfessionnelle()
    return (assiette * taux) / 100
  }

  getAssietteFormationProfessionnelle(): number {
    return this.PASS
  }

  getTauxFormationProfessionnelle(): number {
    return 0.25
  }

  // CSG CRDS
  getCsgCrds(): number {
    return this.getCsgCrdsDeductible() + this.getCsgCrdsNonDeductible()
  }

  getAssietteCsgCrds(): number {
    return (
      this._revenuPro() +
      this.getMaladie() +
      this.getMaladie2() +
      this.caisseRetraite.getRetraiteBase() +
      this.caisseRetraite.getRetraiteComplementaire() +
      this.caisseRetraite.getInvaliditeDeces() +
      this.getAllocationsFamiliales()
    )
  }

  // CSG CRDS DEDUCTIBLE
  getCsgCrdsDeductible(): number {
    const taux = this.getTauxCsgCrdsDeductible()
    const assiette = this.getAssietteCsgCrdsDeductible()
    return (assiette * taux) / 100
  }

  getAssietteCsgCrdsDeductible(): number {
    return this.getAssietteCsgCrds()
  }

  getTauxCsgCrdsDeductible(): number {
    return 2.9
  }

  // CSG CRDS NON DEDUCTIBLE
  getCsgCrdsNonDeductible(): number {
    const taux = this.getTauxCsgCrdsNonDeductible()
    const assiette = this.getAssietteCsgCrdsNonDeductible()
    return (assiette * taux) / 100
  }

  getAssietteCsgCrdsNonDeductible(): number {
    return this.getAssietteCsgCrds()
  }

  getTauxCsgCrdsNonDeductible(): number {
    return 6.8
  }

  // TOTAL COTISATIONS
  getCotisations(): number {
    return (
      this.getMaladie() +
      this.getMaladie2() +
      this.getAllocationsFamiliales() +
      this.getFormationProfessionnelle() +
      this.caisseRetraite.getRetraiteBase() +
      this.caisseRetraite.getRetraiteComplementaire() +
      this.caisseRetraite.getInvaliditeDeces() +
      this.getCsgCrds()
    )
  }
}
