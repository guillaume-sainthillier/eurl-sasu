import type { YearConfig } from '@/types/year-config.types'

/**
 * 2018 Tax Configuration
 * Sources:
 * - PASS 2018: 39,732€
 * - IR brackets: https://www.impots.gouv.fr/
 * - IS brackets: Loi de finances 2018
 * - Flat tax (PFU): Introduced in 2018 at 30% (12.8% IR + 17.2% social contributions)
 */
export const year2018: YearConfig = {
  year: 2018,
  pass: 39732,

  taxBrackets: {
    // Income tax (Impôt sur le Revenu)
    ir: [
      { min: 0, max: 9807, taux: 0 },
      { min: 9808, max: 27086, taux: 0.14 },
      { min: 27087, max: 72617, taux: 0.3 },
      { min: 72618, max: 153783, taux: 0.41 },
      { min: 153784, max: null, taux: 0.45 }
    ],

    // Corporate tax (Impôt sur les Sociétés)
    // Change: Upper limit increased from 75,000 to 500,000
    is: [
      { min: 0, max: 38120, taux: 0.15 },
      { min: 38120, max: 500000, taux: 0.28 },
      { min: 500000, max: null, taux: 0.33 }
    ]
  },

  rates: {
    tauxCsgCrds: 0.172, // 17.2% CSG/CRDS
    tauxCsgDeductible: 0.051, // 5.1% CSG deductible
    tauxAbattementDividendes: 0.4, // 40% dividend abatement (reduced from 60% in 2017)
    tauxAbattementFrais: 0.1, // 10% professional expenses abatement
    tauxAbattementBnc: 0.34, // 34% BNC abatement
    tauxFlatTax: 0.3, // 30% flat tax (12.8% IR + 17.2% social)
    tauxCsSalaire: 0.8185, // SASU employee contributions (~82%)
    tauxAccreCsSalaire: 0.35 // SASU with ACCRE (~35%)
  },

  features: {
    hasPensionFundSelection: true, // CIPAV or SSI selection
    hasFlatTax: true, // Flat tax (PFU) introduced in 2018
    hasZfuExemption: true, // ZFU exemption available
    hasAccre: true // ACCRE available
  },

  defaultForm: 'SASU', // 2018 default
  defaultPensionFund: 'CIPAV' // Default choice
}
