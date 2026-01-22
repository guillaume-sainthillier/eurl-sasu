/**
 * Base parameter configuration
 */
interface BaseParamConfig {
  name: string
  min: number
  max: number
  step: number
}

/**
 * Numeric parameter with slider
 */
export interface NumericParamConfig extends BaseParamConfig {
  value: number
  notSlider?: false
}

/**
 * String parameter (select/radio)
 */
export interface StringParamConfig extends BaseParamConfig {
  value: string
  notSlider: true
}

/**
 * Checkbox parameter (0 or 1)
 */
export interface CheckboxParamConfig extends BaseParamConfig {
  value: 0 | 1
  notSlider: true
}

/**
 * Union type for all parameter configs
 */
export type ParamConfig = NumericParamConfig | StringParamConfig | CheckboxParamConfig

/**
 * Full calculator state
 */
export interface CalculatorState {
  selectedYear: number
  params: {
    capital: NumericParamConfig
    charges: NumericParamConfig
    ca: NumericParamConfig
    nbMois: NumericParamConfig
    remuneration: NumericParamConfig
    dividendes: NumericParamConfig
    autresRevenus: NumericParamConfig
    bnc: NumericParamConfig
    nbParts: NumericParamConfig
    accre: CheckboxParamConfig
    pfu: CheckboxParamConfig
    zfu: CheckboxParamConfig
    forme: StringParamConfig
    caisseRetraite: StringParamConfig
  }
}

/**
 * Saved state for localStorage
 */
export interface SavedState {
  name: string
  year: number
  params: CalculatorState['params']
  savedAt: number // timestamp
}
