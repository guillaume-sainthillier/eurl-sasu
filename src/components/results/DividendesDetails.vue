<script setup lang="ts">
import type { ExerciceResult } from '@/services/ExerciceCalculator'
import { formatCurrency } from '@/utils/formatters'

interface Props {
  result: ExerciceResult
  forme: 'EURL' | 'SASU'
  hasPFU: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div v-if="result.dividendes.brut > 0" class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Détail des dividendes</h3>

    <!-- Summary -->
    <div class="grid grid-cols-3 gap-4 mb-6 p-4 bg-purple-50 rounded-lg">
      <div>
        <div class="text-xs text-gray-600 mb-1">Brut</div>
        <div class="text-sm font-semibold text-purple-700">
          {{ formatCurrency(result.dividendes.brut) }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-600 mb-1">Cotisations</div>
        <div class="text-sm font-semibold text-red-600">
          {{ formatCurrency(result.dividendes.cotisationsSociales) }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-600 mb-1">Net</div>
        <div class="text-sm font-semibold text-green-700">
          {{ formatCurrency(result.dividendes.net) }}
        </div>
      </div>
    </div>

    <!-- EURL: 10% / 90% split -->
    <div v-if="forme === 'EURL' && result.dividendes.dividendes10 && result.dividendes.dividendes90">
      <h4 class="text-sm font-medium text-gray-700 border-b pb-2 mb-3">
        Répartition EURL (10% capital / 90%)
      </h4>

      <div class="space-y-3">
        <!-- First 10% (based on capital) -->
        <div class="p-3 bg-gray-50 rounded text-sm">
          <div class="font-medium text-gray-700 mb-2">
            Première tranche (10% du capital)
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="text-gray-600">Brut :</div>
            <div class="font-mono text-right">
              {{ formatCurrency(result.dividendes.dividendes10.brut) }}
            </div>
            <div class="text-gray-600">Cotisations (17.2%) :</div>
            <div class="font-mono text-right text-red-600">
              {{ formatCurrency(result.dividendes.dividendes10.cotisationsSociales) }}
            </div>
            <div class="text-gray-600">Net :</div>
            <div class="font-mono text-right font-semibold">
              {{ formatCurrency(result.dividendes.dividendes10.net) }}
            </div>
          </div>
        </div>

        <!-- Remaining 90% -->
        <div class="p-3 bg-gray-50 rounded text-sm">
          <div class="font-medium text-gray-700 mb-2">
            Deuxième tranche (au-delà de 10% du capital)
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="text-gray-600">Brut :</div>
            <div class="font-mono text-right">
              {{ formatCurrency(result.dividendes.dividendes90.brut) }}
            </div>
            <div class="text-gray-600">Cotisations (45%) :</div>
            <div class="font-mono text-right text-red-600">
              {{ formatCurrency(result.dividendes.dividendes90.cotisationsSociales) }}
            </div>
            <div class="text-gray-600">Net :</div>
            <div class="font-mono text-right font-semibold">
              {{ formatCurrency(result.dividendes.dividendes90.net) }}
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            ⚠️ Taux élevé : 45% de cotisations sociales au-delà de 10% du capital
          </div>
        </div>
      </div>

      <!-- IR Calculation -->
      <div class="mt-4 p-3 bg-blue-50 rounded text-sm">
        <div class="font-medium text-gray-700 mb-2">Assiette IR (après abattement 40%)</div>
        <div class="text-xs text-gray-600">
          Les dividendes sont soumis au barème progressif de l'IR après un abattement de 40% et déduction de la CSG déductible (5.1%)
        </div>
        <div class="mt-2 font-mono text-right font-semibold">
          {{ formatCurrency(result.dividendes.assietteIR) }}
        </div>
      </div>
    </div>

    <!-- SASU: Standard or PFU -->
    <div v-if="forme === 'SASU'">
      <h4 class="text-sm font-medium text-gray-700 border-b pb-2 mb-3">
        Taxation SASU {{ hasPFU ? '(avec Flat Tax - PFU)' : '(barème progressif)' }}
      </h4>

      <div class="space-y-3">
        <!-- Social Contributions -->
        <div class="p-3 bg-gray-50 rounded text-sm">
          <div class="font-medium text-gray-700 mb-2">Cotisations sociales</div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="text-gray-600">Brut :</div>
            <div class="font-mono text-right">{{ formatCurrency(result.dividendes.brut) }}</div>
            <div class="text-gray-600">CSG/CRDS (17.2%) :</div>
            <div class="font-mono text-right text-red-600">
              {{ formatCurrency(result.dividendes.cotisationsSociales) }}
            </div>
          </div>
        </div>

        <!-- PFU (Flat Tax) -->
        <div v-if="hasPFU" class="p-3 bg-yellow-50 rounded text-sm">
          <div class="font-medium text-gray-700 mb-2">
            Prélèvement Forfaitaire Unique (PFU)
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="text-gray-600">Taux IR (12.8%) :</div>
            <div class="font-mono text-right text-red-600">
              {{ formatCurrency(result.IR.impotPFU) }}
            </div>
            <div class="text-gray-600">Total PFU (30%) :</div>
            <div class="font-mono text-right font-semibold">
              {{ formatCurrency(result.dividendes.cotisationsSociales + result.IR.impotPFU) }}
            </div>
          </div>
          <div class="mt-2 text-xs text-green-600">
            ✓ Taxation forfaitaire à 30% (17.2% social + 12.8% IR)
          </div>
        </div>

        <!-- Standard (barème progressif) -->
        <div v-else class="p-3 bg-blue-50 rounded text-sm">
          <div class="font-medium text-gray-700 mb-2">
            Assiette IR (barème progressif)
          </div>
          <div class="text-xs text-gray-600 mb-2">
            Dividendes après abattement de 40% et déduction CSG (5.1%)
          </div>
          <div class="font-mono text-right font-semibold">
            {{ formatCurrency(result.dividendes.assietteIR) }}
          </div>
          <div class="mt-2 text-xs text-gray-500">
            Cette assiette s'ajoute aux autres revenus pour le calcul de l'IR
          </div>
        </div>

        <!-- Net Final -->
        <div class="p-3 bg-green-50 rounded text-sm">
          <div class="grid grid-cols-2 gap-2">
            <div class="font-medium text-gray-700">Dividendes nets perçus :</div>
            <div class="font-mono text-right text-lg font-semibold text-green-700">
              {{ formatCurrency(result.dividendes.net) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
