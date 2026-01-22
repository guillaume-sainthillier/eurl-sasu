/**
 * Base interface for pension fund calculations
 * Implemented by CIPAV and SSI classes
 */
export interface PensionFundBase {
  revenus: number
  PASS: number

  // Retraite de base
  getRetraiteBase(): number
  getAssietteRetraiteBase(): number
  getTauxRetraiteBase(): number | null

  // Retraite complémentaire
  getRetraiteComplementaire(): number
  getTauxRetraiteComplementaire(): number | null

  // Invalidité Décès
  getInvaliditeDeces(classe?: string): number
  getTauxInvaliditeDeces(): number | null
  getAssietteInvaliditeDeces(): number | null
}
