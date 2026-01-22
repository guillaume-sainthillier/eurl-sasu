<script setup lang="ts">
import type { ExerciceResult } from '@/services/ExerciceCalculator'
import { formatCurrency, formatPercent } from '@/utils/formatters'

interface Props {
  result: ExerciceResult
  hasZFU: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">
      Impôt sur les Sociétés (IS)
    </h3>

    <!-- Summary -->
    <div class="grid grid-cols-2 gap-4 mb-6 p-4 bg-orange-50 rounded-lg">
      <div>
        <div class="text-xs text-gray-600 mb-1">Bénéfice imposable</div>
        <div class="text-sm font-semibold text-orange-700">
          {{ formatCurrency(result.IS.assiette) }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-600 mb-1">IS à payer</div>
        <div class="text-sm font-semibold text-red-600">
          {{ formatCurrency(result.IS.impot) }}
        </div>
      </div>
    </div>

    <!-- ZFU Exemption -->
    <div v-if="hasZFU && result.IS.exonerations > 0" class="mb-4 p-3 bg-green-50 rounded text-sm">
      <div class="font-medium text-green-700 mb-2">
        ✓ Exonération ZFU (Zone Franche Urbaine)
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="text-gray-600">IS calculé :</div>
        <div class="font-mono text-right text-gray-500 line-through">
          {{ formatCurrency(result.IS.exonerations) }}
        </div>
        <div class="text-gray-600">IS exonéré :</div>
        <div class="font-mono text-right font-semibold text-green-600">
          {{ formatCurrency(result.IS.exonerations) }}
        </div>
        <div class="text-gray-600">IS à payer :</div>
        <div class="font-mono text-right font-semibold">
          {{ formatCurrency(result.IS.impot) }}
        </div>
      </div>
      <div class="mt-2 text-xs text-gray-600">
        L'entreprise bénéficie d'une exonération totale d'IS grâce à son implantation en ZFU
      </div>
    </div>

    <!-- Tax Brackets Breakdown -->
    <div class="space-y-3">
      <h4 class="text-sm font-medium text-gray-700 border-b pb-2">
        Détail des tranches d'imposition
      </h4>

      <div
        v-for="(tranche, index) in result.IS.tranches"
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

          <div class="text-gray-600">Impôt :</div>
          <div class="font-mono text-right font-semibold">
            {{ formatCurrency(tranche.value) }}
          </div>
        </div>
      </div>

      <!-- Total -->
      <div class="p-3 bg-orange-100 rounded font-medium">
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="text-gray-700">Total IS :</div>
          <div class="font-mono text-right text-red-700">
            {{ formatCurrency(result.IS.impot) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Company Remaining Profit -->
    <div class="mt-4 p-4 bg-blue-50 rounded text-sm">
      <div class="font-medium text-gray-700 mb-2">Reste dans la société</div>
      <div class="text-xs text-gray-600 mb-2">
        Bénéfice - IS - Dividendes distribués
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="text-gray-600">Bénéfice :</div>
        <div class="font-mono text-right">{{ formatCurrency(result.societe.brut) }}</div>

        <div class="text-gray-600">IS payé :</div>
        <div class="font-mono text-right text-red-600">
          -{{ formatCurrency(result.IS.impot) }}
        </div>

        <div class="text-gray-600">Dividendes distribués :</div>
        <div class="font-mono text-right text-red-600">
          -{{ formatCurrency(result.dividendes.brut) }}
        </div>

        <div class="text-gray-600 font-medium">Reste en réserve :</div>
        <div class="font-mono text-right font-semibold text-blue-700">
          {{ formatCurrency(result.societe.reste) }}
        </div>
      </div>
    </div>
  </div>
</template>
