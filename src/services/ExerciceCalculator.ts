import CotisationsSociales from './CotisationsSociales'
import Cipav from './pension-funds/Cipav'
import SSI from './pension-funds/SSI'
import ImpotRevenu from './ImpotRevenu'
import ImpotSociete from './ImpotSociete'

export interface ExerciceParams {
  capital: number
  ca: number
  charges: number
  remuneration: number
  dividendes: number
  zfu: boolean
  pfu: boolean
  accre: boolean
  autresRevenus: number
  bnc: number
  nbParts: number
  nbMois: number
  forme: 'EURL' | 'SASU'
  caisseRetraite: 'CIPAV' | 'SSI'
}

export interface ExerciceResult {
  remuneration: {
    cotisationsSociales: number
    brut: number
    net: number
    assietteIR: number
    cs?: CotisationsSociales
  }
  dividendes: {
    cotisationsSociales: number
    brut: number
    assietteIR: number
    net: number
    dividendes10?: {
      brut: number
      cotisationsSociales: number
      net: number
    }
    dividendes90?: {
      brut: number
      cotisationsSociales: number
      net: number
    }
  }
  societe: {
    ca: number
    charges: number
    brut: number
    reste: number
  }
  IR: {
    assiette: number
    impot: number
    impotPFU: number
    tranches: any[]
  }
  IS: {
    assiette: number
    impot: number
    exonerations: number
    tranches: any[]
  }
  autresRevenus: number
  bnc: number
  brut: number
  net: number
}

/**
 * Main Exercise Calculator
 * Orchestrates all tax calculations for EURL and SASU companies
 * Supports both 2017 and 2018 tax rules (configured via constants)
 */
export default class ExerciceCalculator {
  // These will be configurable per year in Phase 3
  private PASS: number = 39732 // 2018 value
  private tauxAccreCsSalaire = 0.35
  private tauxCsSalaire = 0.8185
  private plafondAccre = 39228
  private plancherAccreLineaire = this.plafondAccre * 0.75
  private tauxCsgCrds = 0.172
  private tauxAbattementDividendes = 0.4 // 2018: 40%, 2017: 60%
  private tauxCsgDeductible = 0.051
  private tauxAbattementBnc = 0.34
  private tauxAbattementFrais = 0.1
  private tauxFlatTax = 0.3

  private impotSociete: ImpotSociete
  private cotisations: CotisationsSociales
  private impotRevenu: ImpotRevenu

  constructor() {
    this.impotSociete = new ImpotSociete()
    this.cotisations = new CotisationsSociales()
    this.impotRevenu = new ImpotRevenu()
  }

  calculate(params: ExerciceParams): ExerciceResult {
    const res: ExerciceResult = {
      remuneration: {
        cotisationsSociales: 0,
        brut: 0,
        net: 0,
        assietteIR: 0
      },
      dividendes: {
        cotisationsSociales: 0,
        brut: 0,
        assietteIR: 0,
        net: 0
      },
      societe: {
        ca: 0,
        charges: 0,
        brut: 0,
        reste: 0
      },
      IR: {
        assiette: 0,
        impot: 0,
        impotPFU: 0,
        tranches: []
      },
      IS: {
        assiette: 0,
        impot: 0,
        exonerations: 0,
        tranches: []
      },
      autresRevenus: params.autresRevenus,
      bnc: params.bnc,
      brut: 0,
      net: 0
    }

    res.IR.assiette = 0
    res.IS.assiette = 0
    res.dividendes.brut = params.dividendes

    // RÉMUNÉRATION
    res.remuneration.net = params.remuneration

    if (params.forme === 'EURL') {
      // EURL: Self-employed social contributions
      this.cotisations.caisseRetraite =
        params.caisseRetraite === 'CIPAV'
          ? new Cipav(res.remuneration.net, this.PASS)
          : new SSI(res.remuneration.net, this.PASS)

      this.cotisations.remuneration = res.remuneration.net
      this.cotisations.accre = params.accre
      this.cotisations.PASS = this.PASS
      res.remuneration.cs = this.cotisations
      res.remuneration.cotisationsSociales = this.cotisations.getCotisations()
      res.remuneration.brut = res.remuneration.net + res.remuneration.cotisationsSociales
      res.IR.assiette -= this.cotisations.getCsgCrdsDeductible()
    }

    if (params.forme === 'SASU') {
      // SASU: Employee social contributions (simplified calculation)
      const taux =
        params.accre && res.remuneration.net < this.plancherAccreLineaire
          ? this.tauxAccreCsSalaire
          : this.tauxCsSalaire
      res.remuneration.cotisationsSociales = res.remuneration.net * taux
      res.remuneration.brut = res.remuneration.net + res.remuneration.cotisationsSociales
    }

    res.remuneration.assietteIR = res.remuneration.net * (1 - this.tauxAbattementFrais)
    res.IR.assiette += res.remuneration.assietteIR

    // IMPÔT SUR LES SOCIÉTÉS (IS)
    res.societe.ca = params.ca
    res.societe.charges = params.charges
    res.societe.brut = res.societe.ca - res.societe.charges - res.remuneration.brut
    res.IS.assiette = res.societe.brut

    this.impotSociete.benefice = res.IS.assiette
    this.impotSociete.prorata = params.nbMois / 12 // Proratization

    if (!params.zfu) {
      res.IS.exonerations = 0
      res.IS.impot = this.impotSociete.getImpot()
    } else {
      res.IS.exonerations = this.impotSociete.getImpot()
      res.IS.impot = 0 // ZFU exemption
    }

    res.IS.tranches = this.impotSociete.getTranches()
    res.societe.reste = res.societe.brut - res.IS.impot - res.dividendes.brut
    res.IR.impotPFU = 0

    // DIVIDENDES
    if (params.dividendes > 0) {
      if (params.forme === 'SASU') {
        res.dividendes.cotisationsSociales = res.dividendes.brut * this.tauxCsgCrds

        if (!params.pfu) {
          // Standard taxation (without flat tax)
          res.dividendes.net = res.dividendes.brut - res.dividendes.cotisationsSociales
          res.dividendes.assietteIR =
            res.dividendes.brut * (1 - this.tauxAbattementDividendes) -
            res.dividendes.brut * this.tauxCsgDeductible
        } else {
          // Flat tax (PFU)
          res.IR.impotPFU = res.dividendes.brut * (this.tauxFlatTax - this.tauxCsgCrds) // 12.8% IR
          res.dividendes.net =
            res.dividendes.brut - res.dividendes.cotisationsSociales - res.IR.impotPFU
          res.dividendes.assietteIR = 0 // Not subject to progressive tax
        }
      } else {
        // EURL: Distinction between < 10% and > 10% of capital
        const dividendes10 = {
          brut: params.capital * 0.1,
          cotisationsSociales: 0,
          net: 0
        }
        dividendes10.cotisationsSociales = dividendes10.brut * this.tauxCsgCrds
        dividendes10.net = dividendes10.brut - dividendes10.cotisationsSociales
        res.dividendes.dividendes10 = dividendes10

        const dividendes90 = {
          brut: res.dividendes.brut - dividendes10.brut,
          cotisationsSociales: 0,
          net: 0
        }
        dividendes90.cotisationsSociales = dividendes90.brut * 0.45
        dividendes90.net = dividendes90.brut - dividendes90.cotisationsSociales
        res.dividendes.dividendes90 = dividendes90

        res.dividendes.assietteIR =
          dividendes10.brut * (1 - this.tauxAbattementDividendes) -
          dividendes10.brut * this.tauxCsgDeductible +
          (dividendes90.brut * (1 - this.tauxAbattementDividendes) -
            dividendes90.brut * this.tauxCsgDeductible)

        res.dividendes.cotisationsSociales =
          dividendes10.cotisationsSociales + dividendes90.cotisationsSociales
        res.dividendes.net = dividendes10.net + dividendes90.net
      }

      res.IR.assiette += res.dividendes.assietteIR
    }

    // IMPÔT SUR LE REVENU (IR)
    res.IR.assiette += params.autresRevenus * (1 - this.tauxAbattementFrais)
    res.IR.assiette += params.bnc * (1 - this.tauxAbattementBnc)

    this.impotRevenu.revenu = res.IR.assiette
    this.impotRevenu.nbParts = params.nbParts
    res.IR.impot = this.impotRevenu.getImpot() + res.IR.impotPFU
    res.IR.tranches = this.impotRevenu.getTranches()

    // FINAL CALCULATIONS
    res.brut =
      res.societe.ca - res.societe.charges - res.societe.reste + params.autresRevenus + params.bnc

    res.net =
      res.remuneration.net +
      res.dividendes.net +
      params.autresRevenus +
      params.bnc -
      res.IR.impot +
      res.IR.impotPFU

    return res
  }
}
