<script setup lang="ts">
import { ref, onMounted } from 'vue'
import YearSelector from './components/calculator/YearSelector.vue'
import CalculatorForm from './components/calculator/CalculatorForm.vue'
import SavedStates from './components/calculator/SavedStates.vue'
import ResultsSummary from './components/results/ResultsSummary.vue'
import HelpModal from './components/common/HelpModal.vue'
import { useUrlState } from './composables/useUrlState'

const appVersion = ref('2.0.0')
const { loadStateFromUrl, enableUrlSync } = useUrlState()

// Load state from URL on mount
onMounted(() => {
  loadStateFromUrl()
  // Enable URL sync to keep URL updated as params change
  enableUrlSync()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <header class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <div class="flex-1"></div>
          <h1 class="flex-1 text-center text-4xl font-light">
            <span class="text-blue-600">EURL</span> / <span class="text-green-600">SASU</span>
          </h1>
          <div class="flex-1 flex justify-end">
            <HelpModal />
          </div>
        </div>
        <p class="text-center text-base text-gray-500">Calculateur de revenus nets</p>
      </header>

      <main>
        <!-- Year Selector -->
        <YearSelector />

        <!-- Calculator Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left: Parameters -->
          <div class="space-y-6">
            <CalculatorForm />
            <SavedStates />
          </div>

          <!-- Right: Results -->
          <div class="lg:sticky lg:top-4 lg:self-start">
            <ResultsSummary />
          </div>
        </div>
      </main>

      <footer class="mt-12 text-center text-gray-500">
        <small>
          Calculs basés sur les lois fiscales françaises de 2017 et 2018 • Version {{ appVersion }}
        </small>
      </footer>
    </div>
  </div>
</template>

