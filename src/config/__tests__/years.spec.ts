import { describe, it, expect } from 'vitest'
import { AVAILABLE_YEARS, getYearConfig, getLatestYearConfig, getDefaultYearConfig } from '../years'
import { year2017 } from '../years/year2017'
import { year2018 } from '../years/year2018'

describe('Year Configuration System', () => {
  describe('AVAILABLE_YEARS', () => {
    it('should contain exactly 2 years', () => {
      expect(AVAILABLE_YEARS).toHaveLength(2)
    })

    it('should include 2017 and 2018 configurations', () => {
      const years = AVAILABLE_YEARS.map((config) => config.year)
      expect(years).toContain(2017)
      expect(years).toContain(2018)
    })

    it('should be sorted chronologically', () => {
      const years = AVAILABLE_YEARS.map((config) => config.year)
      const sorted = [...years].sort()
      expect(years).toEqual(sorted)
    })
  })

  describe('getYearConfig', () => {
    it('should return 2017 config for year 2017', () => {
      const config = getYearConfig(2017)
      expect(config).toBeDefined()
      expect(config?.year).toBe(2017)
      expect(config?.pass).toBe(39228)
    })

    it('should return 2018 config for year 2018', () => {
      const config = getYearConfig(2018)
      expect(config).toBeDefined()
      expect(config?.year).toBe(2018)
      expect(config?.pass).toBe(39732)
    })

    it('should return undefined for unavailable year', () => {
      const config = getYearConfig(2019)
      expect(config).toBeUndefined()
    })
  })

  describe('getLatestYearConfig', () => {
    it('should return 2018 config', () => {
      const config = getLatestYearConfig()
      expect(config.year).toBe(2018)
    })
  })

  describe('getDefaultYearConfig', () => {
    it('should return 2018 config', () => {
      const config = getDefaultYearConfig()
      expect(config.year).toBe(2018)
    })
  })

  describe('2017 Configuration', () => {
    it('should have correct PASS value', () => {
      expect(year2017.pass).toBe(39228)
    })

    it('should have correct IR brackets', () => {
      expect(year2017.taxBrackets.ir).toHaveLength(5)
      expect(year2017.taxBrackets.ir[0].taux).toBe(0) // 0%
      expect(year2017.taxBrackets.ir[4].taux).toBe(0.45) // 45%
    })

    it('should have correct IS brackets (with 75k limit)', () => {
      expect(year2017.taxBrackets.is).toHaveLength(3)
      expect(year2017.taxBrackets.is[1].max).toBe(75000)
    })

    it('should have 60% dividend abatement', () => {
      expect(year2017.rates.tauxAbattementDividendes).toBe(0.6)
    })

    it('should not have pension fund selection', () => {
      expect(year2017.features.hasPensionFundSelection).toBe(false)
    })

    it('should not have flat tax', () => {
      expect(year2017.features.hasFlatTax).toBe(false)
    })

    it('should default to EURL', () => {
      expect(year2017.defaultForm).toBe('EURL')
    })
  })

  describe('2018 Configuration', () => {
    it('should have correct PASS value', () => {
      expect(year2018.pass).toBe(39732)
    })

    it('should have correct IR brackets', () => {
      expect(year2018.taxBrackets.ir).toHaveLength(5)
      expect(year2018.taxBrackets.ir[0].max).toBe(9807)
      expect(year2018.taxBrackets.ir[4].taux).toBe(0.45)
    })

    it('should have correct IS brackets (with 500k limit)', () => {
      expect(year2018.taxBrackets.is).toHaveLength(3)
      expect(year2018.taxBrackets.is[1].max).toBe(500000)
      expect(year2018.taxBrackets.is[1].taux).toBe(0.28)
    })

    it('should have 40% dividend abatement (reduced from 2017)', () => {
      expect(year2018.rates.tauxAbattementDividendes).toBe(0.4)
    })

    it('should have pension fund selection', () => {
      expect(year2018.features.hasPensionFundSelection).toBe(true)
    })

    it('should have flat tax', () => {
      expect(year2018.features.hasFlatTax).toBe(true)
      expect(year2018.rates.tauxFlatTax).toBe(0.3)
    })

    it('should have ZFU exemption', () => {
      expect(year2018.features.hasZfuExemption).toBe(true)
    })

    it('should default to SASU', () => {
      expect(year2018.defaultForm).toBe('SASU')
    })
  })
})
