import type { YearConfig } from '@/types/year-config.types'

/**
 * 2017 Tax Configuration
 * Sources:
 * - PASS 2017: 39,228€
 * - IR brackets: https://www.impots.gouv.fr/
 * - IS brackets: Loi de finances 2017
 */
export const year2017: YearConfig = {
  year: 2017,
  pass: 39228,

  taxBrackets: {
    // Income tax (Impôt sur le Revenu) - barème 2017 (revenus 2016)
    // Brackets must be contiguous: each min equals the previous max
    ir: [
      { min: 0, max: 9710, taux: 0 },
      { min: 9710, max: 26818, taux: 0.14 },
      { min: 26818, max: 71898, taux: 0.3 },
      { min: 71898, max: 152260, taux: 0.41 },
      { min: 152260, max: null, taux: 0.45 }
    ],

    // Corporate tax (Impôt sur les Sociétés) - 28% for SME profits up to 75,000€
    is: [
      { min: 0, max: 38120, taux: 0.15 },
      { min: 38120, max: 75000, taux: 0.28 },
      { min: 75000, max: null, taux: 0.333 }
    ]
  },

  rates: {
    tauxCsgCrds: 0.155, // 15.5% prélèvements sociaux (17.2% from 2018)
    tauxCsgDeductible: 0.051, // 5.1% CSG deductible
    tauxAbattementDividendes: 0.4, // 40% dividend abatement
    tauxAbattementFrais: 0.1, // 10% professional expenses abatement
    tauxAbattementBnc: 0.34, // 34% BNC abatement
    tauxFlatTax: 0, // No flat tax in 2017
    tauxCsSalaire: 0.89, // SASU employee contributions (~89%)
    tauxAccreCsSalaire: 0.35 // SASU with ACCRE (~35%)
  },

  features: {
    hasPensionFundSelection: false, // Fixed CIPAV-like in 2017
    hasFlatTax: false, // Flat tax introduced in 2018
    hasZfuExemption: false, // ZFU not in scope for 2017
    hasAccre: true // ACCRE available
  },

  defaultForm: 'EURL', // 2017 default
  defaultPensionFund: 'CIPAV' // Only CIPAV in 2017
}
