<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCalculation } from '@/composables/useCalculation'
import { formatCurrency } from '@/utils/formatters'
import RemunerationDetails from './RemunerationDetails.vue'
import DividendesDetails from './DividendesDetails.vue'
import ImpotSocieteDetails from './ImpotSocieteDetails.vue'
import ImpotRevenuDetails from './ImpotRevenuDetails.vue'

const { result, params } = useCalculation()

const showDetailedBreakdown = ref(false)

const totalTaxes = computed(() => {
  if (!result.value) return 0
  return (
    result.value.remuneration.cotisationsSociales +
    result.value.dividendes.cotisationsSociales +
    result.value.IR.impot +
    result.value.IS.impot
  )
})

const effectiveTaxRate = computed(() => {
  if (!result.value || result.value.brut === 0) return 0
  return (totalTaxes.value / result.value.brut) * 100
})
</script>

<template>
  <div class="space-y-6">
    <!-- Main Summary Card -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Résultats</h2>

      <div v-if="!result" class="text-center py-8 text-gray-500">
        <p>Configurez les paramètres pour voir les résultats</p>
      </div>

      <div v-else class="space-y-4">
        <!-- Net Income (Main Result) -->
        <div class="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
          <div class="text-sm text-gray-600 mb-1">Revenu net total</div>
          <div class="text-3xl font-bold text-green-700">
            {{ formatCurrency(result.net) }}
          </div>
        </div>

        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="text-sm text-gray-600 mb-1">Revenu brut</div>
            <div class="text-xl font-semibold text-blue-700">
              {{ formatCurrency(result.brut) }}
            </div>
          </div>

          <div class="p-4 bg-red-50 rounded-lg">
            <div class="text-sm text-gray-600 mb-1">Total taxes & cotisations</div>
            <div class="text-xl font-semibold text-red-700">
              {{ formatCurrency(totalTaxes) }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              Taux effectif : {{ effectiveTaxRate.toFixed(1) }}%
            </div>
          </div>
        </div>

        <!-- Quick Summary -->
        <div class="border-t pt-4 mt-4">
          <h3 class="text-lg font-medium text-gray-700 mb-3">Résumé</h3>

          <div class="space-y-2 text-sm">
            <!-- Remuneration -->
            <div class="flex justify-between p-2 bg-gray-50 rounded">
              <span class="text-gray-600">Rémunération nette</span>
              <span class="font-mono font-semibold">{{ formatCurrency(result.remuneration.net) }}</span>
            </div>

            <!-- Dividends -->
            <div v-if="result.dividendes.brut > 0" class="flex justify-between p-2 bg-gray-50 rounded">
              <span class="text-gray-600">Dividendes nets</span>
              <span class="font-mono font-semibold">{{ formatCurrency(result.dividendes.net) }}</span>
            </div>

            <!-- IS -->
            <div class="flex justify-between p-2 bg-gray-50 rounded">
              <span class="text-gray-600">IS</span>
              <span class="font-mono font-semibold text-red-600">
                -{{ formatCurrency(result.IS.impot) }}
              </span>
            </div>

            <!-- IR -->
            <div class="flex justify-between p-2 bg-gray-50 rounded">
              <span class="text-gray-600">IR</span>
              <span class="font-mono font-semibold text-red-600">
                -{{ formatCurrency(result.IR.impot) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Toggle Details Button -->
        <button
          @click="showDetailedBreakdown = !showDetailedBreakdown"
          class="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {{ showDetailedBreakdown ? 'Masquer' : 'Afficher' }} le détail complet
        </button>
      </div>
    </div>

    <!-- Detailed Breakdown Components -->
    <div v-if="result && showDetailedBreakdown" class="space-y-6">
      <RemunerationDetails
        :result="result"
        :forme="(params.forme.value as string) as 'EURL' | 'SASU'"
      />

      <DividendesDetails
        v-if="result.dividendes.brut > 0"
        :result="result"
        :forme="(params.forme.value as string) as 'EURL' | 'SASU'"
        :has-p-f-u="Boolean(params.pfu.value)"
      />

      <ImpotSocieteDetails
        :result="result"
        :has-z-f-u="Boolean(params.zfu.value)"
      />

      <ImpotRevenuDetails
        :result="result"
        :nb-parts="params.nbParts.value"
      />
    </div>
  </div>
</template>
