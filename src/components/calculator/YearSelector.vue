<script setup lang="ts">
import { computed } from 'vue'
import { AVAILABLE_YEARS } from '@/config/years'
import { useCalculation } from '@/composables/useCalculation'

const { selectedYear, setYear, yearConfig } = useCalculation()

const yearsList = computed(() => {
  return AVAILABLE_YEARS.map((config) => ({
    year: config.year,
    pass: config.pass,
    features: config.features
  }))
})

const featuresList = computed(() => {
  if (!yearConfig.value) return []

  const features = []
  if (yearConfig.value.features.hasAccre) features.push('ACCRE')
  if (yearConfig.value.features.hasFlatTax) features.push('Flat Tax')
  if (yearConfig.value.features.hasPensionFundSelection) features.push('CIPAV/SSI')
  if (yearConfig.value.features.hasZfuExemption) features.push('ZFU')

  return features
})

function handleYearChange(event: Event) {
  const target = event.target as HTMLSelectElement
  setYear(Number(target.value))
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Année fiscale</h2>

    <div class="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div class="flex-1">
        <label for="year-select" class="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner l'année
        </label>
        <select
          id="year-select"
          :value="selectedYear"
          @change="handleYearChange"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        >
          <option v-for="year in yearsList" :key="year.year" :value="year.year">
            {{ year.year }}
          </option>
        </select>
      </div>

      <div v-if="yearConfig" class="flex-1">
        <div class="text-sm text-gray-600">
          <div class="font-medium mb-1">PASS: {{ yearConfig.pass.toLocaleString('fr-FR') }} €</div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="feature in featuresList"
              :key="feature"
              class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
            >
              {{ feature }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="yearConfig" class="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
      <strong>Année {{ yearConfig.year }}</strong> - Régime par défaut :
      <span class="font-semibold text-blue-600">{{ yearConfig.defaultForm }}</span>
    </div>
  </div>
</template>
