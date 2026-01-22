<script setup lang="ts">
import { computed } from 'vue'
import type { ExerciceResult } from '@/services/ExerciceCalculator'
import { formatCurrency } from '@/utils/formatters'

interface Props {
  result: ExerciceResult
  forme: 'EURL' | 'SASU'
}

const props = defineProps<Props>()

const formatPercent = (value: number | null): string => {
  if (value === null) return 'Forfaitaire'
  return `${value.toFixed(2)} %`
}

const showCotisationsDetail = computed(() => {
  return props.forme === 'EURL' && props.result.remuneration.cs
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Détail des rémunérations</h3>

    <!-- Summary -->
    <div class="grid grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
      <div>
        <div class="text-xs text-gray-600 mb-1">Brut</div>
        <div class="text-sm font-semibold text-blue-700">
          {{ formatCurrency(result.remuneration.brut) }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-600 mb-1">Cotisations</div>
        <div class="text-sm font-semibold text-red-600">
          {{ formatCurrency(result.remuneration.cotisationsSociales) }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-600 mb-1">Net</div>
        <div class="text-sm font-semibold text-green-700">
          {{ formatCurrency(result.remuneration.net) }}
        </div>
      </div>
    </div>

    <!-- EURL: Detailed Social Contributions -->
    <div v-if="showCotisationsDetail" class="space-y-3">
      <h4 class="text-sm font-medium text-gray-700 border-b pb-2">
        Cotisations sociales ({{ forme }})
      </h4>

      <!-- Maladie -->
      <div class="p-3 bg-gray-50 rounded text-sm">
        <div class="font-medium text-gray-700 mb-2">Maladie</div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="text-gray-600">Assiette :</div>
          <div class="font-mono text-right">
            {{ formatCurrency(result.remuneration.cs!.getAssietteMaladie()) }}
          </div>
          <div class="text-gray-600">Taux :</div>
          <div class="font-mono text-right">{{ formatPercent(result.remuneration.cs!.getTauxMaladie()) }}</div>
          <div class="text-gray-600">Montant :</div>
          <div class="font-mono text-right font-semibold">
            {{ formatCurrency(result.remuneration.cs!.getMaladie()) }}
          </div>
        </div>
      </div>

      <!-- Maladie 2 -->
      <div class="p-3 bg-gray-50 rounded text-sm">
        <div class="font-medium text-gray-700 mb-2">Maladie complémentaire</div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="text-gray-600">Assiette :</div>
          <div class="font-mono text-right">
            {{ formatCurrency(result.remuneration.cs!.getAssietteMaladie2()) }}
          </div>
          <div class="text-gray-600">Taux :</div>
          <div class="font-mono text-right">{{ formatPercent(result.remuneration.cs!.getTauxMaladie2()) }}</div>
          <div class="text-gray-600">Montant :</div>
          <div class="font-mono text-right font-semibold">
            {{ formatCurrency(result.remuneration.cs!.getMaladie2()) }}
          </div>
        </div>
      </div>

      <!-- Allocations Familiales -->
      <div class="p-3 bg-gray-50 rounded text-sm">
        <div class="font-medium text-gray-700 mb-2">Allocations Familiales</div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="text-gray-600">Assiette :</div>
          <div class="font-mono text-right">
            {{ formatCurrency(result.remuneration.cs!.getAssietteAllocationsFamiliales()) }}
          </div>
          <div class="text-gray-600">Taux :</div>
          <div class="font-mono text-right">
            {{ formatPercent(result.remuneration.cs!.getTauxAllocationsFamiliales()) }}
          </div>
          <div class="text-gray-600">Montant :</div>
          <div class="font-mono text-right font-semibold">
            {{ formatCurrency(result.remuneration.cs!.getAllocationsFamiliales()) }}
          </div>
        </div>
      </div>

      <!-- Formation Professionnelle -->
      <div class="p-3 bg-gray-50 rounded text-sm">
        <div class="font-medium text-gray-700 mb-2">Formation Professionnelle</div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="text-gray-600">Assiette :</div>
          <div class="font-mono text-right">
            {{ formatCurrency(result.remuneration.cs!.getAssietteFormationProfessionnelle()) }}
          </div>
          <div class="text-gray-600">Taux :</div>
          <div class="font-mono text-right">
            {{ formatPercent(result.remuneration.cs!.getTauxFormationProfessionnelle()) }}
          </div>
          <div class="text-gray-600">Montant :</div>
          <div class="font-mono text-right font-semibold">
            {{ formatCurrency(result.remuneration.cs!.getFormationProfessionnelle()) }}
          </div>
        </div>
      </div>

      <!-- Retraite Base -->
      <div class="p-3 bg-gray-50 rounded text-sm">
        <div class="font-medium text-gray-700 mb-2">Retraite de Base</div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="text-gray-600">Assiette :</div>
          <div class="font-mono text-right">
            {{ formatCurrency(result.remuneration.cs!.caisseRetraite.getAssietteRetraiteBase()) }}
          </div>
          <div class="text-gray-600">Taux :</div>
          <div class="font-mono text-right">
            {{ formatPercent(result.remuneration.cs!.caisseRetraite.getTauxRetraiteBase()) }}
          </div>
          <div class="text-gray-600">Montant :</div>
          <div class="font-mono text-right font-semibold">
            {{ formatCurrency(result.remuneration.cs!.caisseRetraite.getRetraiteBase()) }}
          </div>
        </div>
      </div>

      <!-- Retraite Complémentaire -->
      <div class="p-3 bg-gray-50 rounded text-sm">
        <div class="font-medium text-gray-700 mb-2">Retraite Complémentaire</div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="text-gray-600">Taux :</div>
          <div class="font-mono text-right">
            {{ formatPercent(result.remuneration.cs!.caisseRetraite.getTauxRetraiteComplementaire()) }}
          </div>
          <div class="text-gray-600">Montant :</div>
          <div class="font-mono text-right font-semibold">
            {{ formatCurrency(result.remuneration.cs!.caisseRetraite.getRetraiteComplementaire()) }}
          </div>
        </div>
      </div>

      <!-- Invalidité Décès -->
      <div class="p-3 bg-gray-50 rounded text-sm">
        <div class="font-medium text-gray-700 mb-2">Invalidité Décès</div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="text-gray-600">Montant :</div>
          <div class="font-mono text-right font-semibold">
            {{ formatCurrency(result.remuneration.cs!.caisseRetraite.getInvaliditeDeces()) }}
          </div>
        </div>
      </div>

      <!-- CSG/CRDS -->
      <div class="p-3 bg-gray-50 rounded text-sm">
        <div class="font-medium text-gray-700 mb-2">CSG/CRDS</div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="text-gray-600">Assiette :</div>
          <div class="font-mono text-right">
            {{ formatCurrency(result.remuneration.cs!.getAssietteCsgCrds()) }}
          </div>
          <div class="text-gray-600">Déductible (6.8%) :</div>
          <div class="font-mono text-right">
            {{ formatCurrency(result.remuneration.cs!.getCsgCrdsDeductible()) }}
          </div>
          <div class="text-gray-600">Non déductible (2.9%) :</div>
          <div class="font-mono text-right">
            {{ formatCurrency(result.remuneration.cs!.getCsgCrdsNonDeductible()) }}
          </div>
          <div class="text-gray-600">Total :</div>
          <div class="font-mono text-right font-semibold">
            {{ formatCurrency(result.remuneration.cs!.getCsgCrds()) }}
          </div>
        </div>
      </div>
    </div>

    <!-- SASU: Simplified -->
    <div v-else class="p-4 bg-gray-50 rounded text-sm">
      <p class="text-gray-600 mb-2">
        En SASU, les cotisations sociales sont calculées de manière simplifiée (~82% du net, ou ~35% avec ACCRE).
      </p>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="text-gray-600">Net :</div>
        <div class="font-mono text-right">{{ formatCurrency(result.remuneration.net) }}</div>
        <div class="text-gray-600">Cotisations :</div>
        <div class="font-mono text-right">
          {{ formatCurrency(result.remuneration.cotisationsSociales) }}
        </div>
        <div class="text-gray-600">Brut :</div>
        <div class="font-mono text-right font-semibold">
          {{ formatCurrency(result.remuneration.brut) }}
        </div>
      </div>
    </div>
  </div>
</template>
