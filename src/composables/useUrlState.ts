import { watch } from 'vue'
import { useCalculatorStore } from '@/stores/calculator'

export function useUrlState() {
  const calculatorStore = useCalculatorStore()

  /**
   * Encode calculator state to URL parameters
   */
  function encodeStateToUrl(): string {
    const params = new URLSearchParams()

    // Add year
    params.set('year', calculatorStore.selectedYear.toString())

    // Add all param values
    params.set('capital', calculatorStore.params.capital.value.toString())
    params.set('charges', calculatorStore.params.charges.value.toString())
    params.set('ca', calculatorStore.params.ca.value.toString())
    params.set('nbMois', calculatorStore.params.nbMois.value.toString())
    params.set('remuneration', calculatorStore.params.remuneration.value.toString())
    params.set('dividendes', calculatorStore.params.dividendes.value.toString())
    params.set('autresRevenus', calculatorStore.params.autresRevenus.value.toString())
    params.set('bnc', calculatorStore.params.bnc.value.toString())
    params.set('nbParts', calculatorStore.params.nbParts.value.toString())
    params.set('accre', calculatorStore.params.accre.value.toString())
    params.set('pfu', calculatorStore.params.pfu.value.toString())
    params.set('zfu', calculatorStore.params.zfu.value.toString())
    params.set('forme', calculatorStore.params.forme.value)
    params.set('caisseRetraite', calculatorStore.params.caisseRetraite.value)

    const baseUrl = window.location.origin + window.location.pathname
    return `${baseUrl}?${params.toString()}`
  }

  /**
   * Decode URL parameters and apply to calculator state
   */
  function loadStateFromUrl() {
    const params = new URLSearchParams(window.location.search)

    // Load year first
    const year = params.get('year')
    if (year && (year === '2017' || year === '2018')) {
      calculatorStore.setYear(parseInt(year))
    }

    // Load numeric params
    const capital = params.get('capital')
    if (capital) calculatorStore.updateParam('capital', parseFloat(capital))

    const charges = params.get('charges')
    if (charges) calculatorStore.updateParam('charges', parseFloat(charges))

    const ca = params.get('ca')
    if (ca) calculatorStore.updateParam('ca', parseFloat(ca))

    const nbMois = params.get('nbMois')
    if (nbMois) calculatorStore.updateParam('nbMois', parseFloat(nbMois))

    const remuneration = params.get('remuneration')
    if (remuneration) calculatorStore.updateParam('remuneration', parseFloat(remuneration))

    const dividendes = params.get('dividendes')
    if (dividendes) calculatorStore.updateParam('dividendes', parseFloat(dividendes))

    const autresRevenus = params.get('autresRevenus')
    if (autresRevenus) calculatorStore.updateParam('autresRevenus', parseFloat(autresRevenus))

    const bnc = params.get('bnc')
    if (bnc) calculatorStore.updateParam('bnc', parseFloat(bnc))

    const nbParts = params.get('nbParts')
    if (nbParts) calculatorStore.updateParam('nbParts', parseFloat(nbParts))

    // Load checkboxes
    const accre = params.get('accre')
    if (accre) calculatorStore.updateParam('accre', parseInt(accre) as 0 | 1)

    const pfu = params.get('pfu')
    if (pfu) calculatorStore.updateParam('pfu', parseInt(pfu) as 0 | 1)

    const zfu = params.get('zfu')
    if (zfu) calculatorStore.updateParam('zfu', parseInt(zfu) as 0 | 1)

    // Load string params
    const forme = params.get('forme')
    if (forme && (forme === 'EURL' || forme === 'SASU')) {
      calculatorStore.updateParam('forme', forme)
    }

    const caisseRetraite = params.get('caisseRetraite')
    if (caisseRetraite && (caisseRetraite === 'CIPAV' || caisseRetraite === 'SSI')) {
      calculatorStore.updateParam('caisseRetraite', caisseRetraite)
    }
  }

  /**
   * Copy current state URL to clipboard
   */
  async function copyShareableLink(): Promise<boolean> {
    const url = encodeStateToUrl()
    try {
      await navigator.clipboard.writeText(url)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }

  /**
   * Update URL without page reload when state changes
   */
  function enableUrlSync() {
    watch(
      [
        () => calculatorStore.selectedYear,
        () => calculatorStore.params.capital.value,
        () => calculatorStore.params.charges.value,
        () => calculatorStore.params.ca.value,
        () => calculatorStore.params.nbMois.value,
        () => calculatorStore.params.remuneration.value,
        () => calculatorStore.params.dividendes.value,
        () => calculatorStore.params.autresRevenus.value,
        () => calculatorStore.params.bnc.value,
        () => calculatorStore.params.nbParts.value,
        () => calculatorStore.params.accre.value,
        () => calculatorStore.params.pfu.value,
        () => calculatorStore.params.zfu.value,
        () => calculatorStore.params.forme.value,
        () => calculatorStore.params.caisseRetraite.value
      ],
      () => {
        const params = new URLSearchParams()
        params.set('year', calculatorStore.selectedYear.toString())
        params.set('capital', calculatorStore.params.capital.value.toString())
        params.set('charges', calculatorStore.params.charges.value.toString())
        params.set('ca', calculatorStore.params.ca.value.toString())
        params.set('nbMois', calculatorStore.params.nbMois.value.toString())
        params.set('remuneration', calculatorStore.params.remuneration.value.toString())
        params.set('dividendes', calculatorStore.params.dividendes.value.toString())
        params.set('autresRevenus', calculatorStore.params.autresRevenus.value.toString())
        params.set('bnc', calculatorStore.params.bnc.value.toString())
        params.set('nbParts', calculatorStore.params.nbParts.value.toString())
        params.set('accre', calculatorStore.params.accre.value.toString())
        params.set('pfu', calculatorStore.params.pfu.value.toString())
        params.set('zfu', calculatorStore.params.zfu.value.toString())
        params.set('forme', calculatorStore.params.forme.value)
        params.set('caisseRetraite', calculatorStore.params.caisseRetraite.value)

        // Update URL without reload
        const newUrl = `${window.location.pathname}?${params.toString()}`
        window.history.replaceState({}, '', newUrl)
      },
      { deep: true }
    )
  }

  return {
    encodeStateToUrl,
    loadStateFromUrl,
    copyShareableLink,
    enableUrlSync
  }
}
