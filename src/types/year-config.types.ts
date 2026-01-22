/**
 * Type definitions for year-specific tax configurations
 */

export interface TaxBracket {
  min: number
  max: number | null
  taux: number
}

export interface YearFeatures {
  hasPensionFundSelection: boolean // CIPAV/SSI selection (2018+)
  hasFlatTax: boolean // PFU (2018+)
  hasZfuExemption: boolean // ZFU (2018+)
  hasAccre: boolean // ACCRE (both years)
}

export interface TaxRates {
  tauxCsgCrds: number
  tauxCsgDeductible: number
  tauxAbattementDividendes: number
  tauxAbattementFrais: number
  tauxAbattementBnc: number
  tauxFlatTax: number // PFU rate (for 2018)
  tauxCsSalaire: number // SASU employee social contributions
  tauxAccreCsSalaire: number // SASU with ACCRE
}

export interface YearConfig {
  year: number
  pass: number // Plafond Annuel de la Sécurité Sociale
  taxBrackets: {
    ir: TaxBracket[] // Income tax brackets
    is: TaxBracket[] // Corporate tax brackets
  }
  rates: TaxRates
  features: YearFeatures
  defaultForm: 'EURL' | 'SASU' // Default company form for this year
  defaultPensionFund: 'CIPAV' | 'SSI' // Default pension fund
}
