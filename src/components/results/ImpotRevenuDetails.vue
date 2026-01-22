<script setup lang="ts">
import type { ExerciceResult } from '@/services/ExerciceCalculator'
import { formatCurrency, formatPercent } from '@/utils/formatters'

interface Props {
  result: ExerciceResult
  nbParts: number
}

const props = defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">
      Impôt sur le Revenu (IR)
    </h3>

    <!-- Summary -->
    <div class="grid grid-cols-2 gap-4 mb-6 p-4 bg-indigo-50 rounded-lg">
      <div>
        <div class="text-xs text-gray-600 mb-1">Revenu imposable</div>
        <div class="text-sm font-semibold text-indigo-700">
          {{ formatCurrency(result.IR.assiette) }}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          Pour {{ nbParts }} part{{ nbParts > 1 ? 's' : '' }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-600 mb-1">IR à payer</div>
        <div class="text-sm font-semibold text-red-600">
          {{ formatCurrency(result.IR.impot) }}
        </div>
      </div>
    </div>

    <!-- Income Breakdown -->
    <div class="mb-6 space-y-2">
      <h4 class="text-sm font-medium text-gray-700 border-b pb-2">
        Composition du revenu imposable
      </h4>

      <div class="p-3 bg-gray-50 rounded text-sm">
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="text-gray-600">Rémunération (assiette) :</div>
          <div class="font-mono text-right">
            {{ formatCurrency(result.remuneration.assietteIR) }}
          </div>

          <div v-if="result.dividendes.assietteIR > 0" class="text-gray-600">Dividendes (assiette) :</div>
          <div v-if="result.dividendes.assietteIR > 0" class="font-mono text-right">
            {{ formatCurrency(result.dividendes.assietteIR) }}
          </div>

          <div v-if="result.autresRevenus > 0" class="text-gray-600">Autres revenus (assiette) :</div>
          <div v-if="result.autresRevenus > 0" class="font-mono text-right">
            {{ formatCurrency(result.autresRevenus * 0.9) }}
          </div>

          <div v-if="result.bnc > 0" class="text-gray-600">BNC (assiette) :</div>
          <div v-if="result.bnc > 0" class="font-mono text-right">
            {{ formatCurrency(result.bnc * 0.66) }}
          </div>

          <div class="text-gray-700 font-medium border-t pt-2">Total :</div>
          <div class="font-mono text-right font-semibold border-t pt-2">
            {{ formatCurrency(result.IR.assiette) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Tax Brackets Breakdown -->
    <div class="space-y-3">
      <h4 class="text-sm font-medium text-gray-700 border-b pb-2">
        Détail des tranches d'imposition (par part)
      </h4>

      <div class="text-xs text-gray-600 mb-2 p-2 bg-blue-50 rounded">
        Le revenu est divisé par {{ nbParts }} part{{ nbParts > 1 ? 's' : '' }}, puis l'IR calculé est multiplié par {{ nbParts }}.
        Revenu par part : {{ formatCurrency(result.IR.assiette / nbParts) }}
      </div>

      <div
        v-for="(tranche, index) in result.IR.tranches"
        :key="index"
        class="p-3 bg-gray-50 rounded text-sm"
      >
        <div class="flex justify-between items-start mb-2">
          <div class="font-medium text-gray-700">Tranche {{ index + 1 }}</div>
          <div class="text-xs text-gray-500">Taux : {{ formatPercent(tranche.taux) }}</div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="text-gray-600">De :</div>
          <div class="font-mono text-right">{{ formatCurrency(tranche.min) }}</div>

          <div class="text-gray-600">À :</div>
          <div class="font-mono text-right">
            {{ tranche.max !== null ? formatCurrency(tranche.max) : 'Illimité' }}
          </div>

          <div class="text-gray-600">Impôt (×{{ nbParts }}) :</div>
          <div class="font-mono text-right font-semibold">
            {{ formatCurrency(tranche.value) }}
          </div>
        </div>
      </div>

      <!-- PFU (if applicable) -->
      <div v-if="result.IR.impotPFU > 0" class="p-3 bg-yellow-50 rounded text-sm">
        <div class="font-medium text-gray-700 mb-2">
          + Prélèvement Forfaitaire Unique (PFU)
        </div>
        <div class="text-xs text-gray-600 mb-2">
          IR flat tax sur dividendes (12.8%)
        </div>
        <div class="font-mono text-right font-semibold text-orange-600">
          {{ formatCurrency(result.IR.impotPFU) }}
        </div>
      </div>

      <!-- Total IR -->
      <div class="p-3 bg-indigo-100 rounded font-medium">
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="text-gray-700">Total IR à payer :</div>
          <div class="font-mono text-right text-red-700">
            {{ formatCurrency(result.IR.impot) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Effective Tax Rate -->
    <div class="mt-4 p-3 bg-gray-50 rounded text-sm">
      <div class="font-medium text-gray-700 mb-1">Taux moyen d'imposition</div>
      <div class="text-xs text-gray-600 mb-2">
        IR total / Revenu imposable
      </div>
      <div class="text-2xl font-semibold text-indigo-700">
        {{ result.IR.assiette > 0 ? ((result.IR.impot / result.IR.assiette) * 100).toFixed(2) : 0 }} %
      </div>
    </div>
  </div>
</template>
