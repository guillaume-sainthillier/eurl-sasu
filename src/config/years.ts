import type { YearConfig } from '@/types/year-config.types'
import { year2017 } from './years/year2017'
import { year2018 } from './years/year2018'

/**
 * Available tax years
 * Sorted chronologically for easy iteration
 */
export const AVAILABLE_YEARS: YearConfig[] = [year2017, year2018]

/**
 * Get configuration for a specific year
 * @param year The tax year (2017, 2018, etc.)
 * @returns Year configuration or undefined if not found
 */
export function getYearConfig(year: number): YearConfig | undefined {
  return AVAILABLE_YEARS.find((config) => config.year === year)
}

/**
 * Get the latest available year configuration
 * @returns The most recent year configuration
 */
export function getLatestYearConfig(): YearConfig {
  return AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]
}

/**
 * Get the default (recommended) year configuration
 * Currently returns 2018 as it has the most features
 * @returns The default year configuration
 */
export function getDefaultYearConfig(): YearConfig {
  return year2018
}
