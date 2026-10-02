import CotisationsSociales from './CotisationsSociales'

/**
 * Social Contributions Calculator for EURL - 2017 rules
 * Ported from the original 2017 application (CIPAV only)
 */
export default class CotisationsSociales2017 extends CotisationsSociales {
  PASS: number = 39228

  // ACCRE 2017: contributions waived below this income
  static readonly PLAFOND_ACCRE = 28962

  isExonereAccre(): boolean {
    return this.accre && this._revenuPro() < CotisationsSociales2017.PLAFOND_ACCRE
  }

  // MALADIE: flat 6.5% on income, no minimum base
  getAssietteMaladie(): number {
    return this._revenuPro()
  }

  getTauxMaladie(): number {
    return 6.5
  }

  // MALADIE 2 (daily allowances): not part of the 2017 model
  getTauxMaladie2(): number {
    return 0
  }

  // ALLOCATIONS FAMILIALES: 2.15% up to 110% PASS, progressive to 5.25% at 140% PASS
  getTauxAllocationsFamiliales(): number {
    const assiette = this.getAssietteAllocationsFamiliales()
    const montantMin = (110 * this.PASS) / 100
    const montantMax = (140 * this.PASS) / 100

    if (assiette <= montantMin) {
      return 2.15
    }
    if (assiette >= montantMax) {
      return 5.25
    }

    return this._tauxProgressif(montantMin, 2.15, montantMax, 5.25, assiette)
  }

  // CSG CRDS: 8% (5.1% deductible), on income + health, family and basic pension
  getAssietteCsgCrds(): number {
    if (this.isExonereAccre()) {
      return this._revenuPro()
    }

    return (
      this._revenuPro() +
      this.getMaladie() +
      this.getAllocationsFamiliales() +
      this.caisseRetraite.getRetraiteBase()
    )
  }

  getTauxCsgCrdsDeductible(): number {
    return 5.1
  }

  getTauxCsgCrdsNonDeductible(): number {
    return 2.9
  }

  // ACCRE: health, family, pension and disability contributions are waived
  getExonerationAccre(): number {
    if (!this.isExonereAccre()) {
      return 0
    }

    return (
      this.getMaladie() +
      this.getAllocationsFamiliales() +
      this.caisseRetraite.getRetraiteBase() +
      this.caisseRetraite.getRetraiteComplementaire() +
      this.caisseRetraite.getInvaliditeDeces()
    )
  }
}
