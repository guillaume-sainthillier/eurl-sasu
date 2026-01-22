<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSavedStatesStore } from '@/stores/savedStates'
import { useCalculatorStore } from '@/stores/calculator'
import { formatDate } from '@/utils/formatters'
import { Save, Download, Upload, Trash2 } from 'lucide-vue-next'
import ShareLink from './ShareLink.vue'

const savedStatesStore = useSavedStatesStore()
const calculatorStore = useCalculatorStore()

const showSaveDialog = ref(false)
const showImportDialog = ref(false)
const saveName = ref('')
const importData = ref('')
const importError = ref('')

const hasLocalStorage = computed(() => savedStatesStore.hasLocalStorage())

const sortedStates = computed(() => {
  return [...savedStatesStore.savedStates].sort((a, b) => b.savedAt - a.savedAt)
})

function openSaveDialog() {
  saveName.value = savedStatesStore.currentStateName || ''
  showSaveDialog.value = true
}

function handleSave() {
  if (!saveName.value.trim()) {
    return
  }

  savedStatesStore.saveState(
    saveName.value.trim(),
    calculatorStore.selectedYear,
    calculatorStore.params
  )

  showSaveDialog.value = false
  saveName.value = ''
}

function handleLoad(name: string) {
  const state = savedStatesStore.loadState(name)
  if (state) {
    // Restore year
    calculatorStore.setYear(state.year)

    // Restore all params
    Object.keys(state.params).forEach((key) => {
      const paramKey = key as keyof typeof state.params
      calculatorStore.updateParam(paramKey, state.params[paramKey].value)
    })
  }
}

function handleDelete(name: string) {
  if (confirm(`Supprimer la sauvegarde "${name}" ?`)) {
    savedStatesStore.deleteState(name)
  }
}

function handleExport() {
  const data = savedStatesStore.exportStates()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `eurl-sasu-sauvegardes-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleImport() {
  importError.value = ''
  if (!importData.value.trim()) {
    importError.value = 'Veuillez coller des données JSON valides'
    return
  }

  const success = savedStatesStore.importStates(importData.value)
  if (success) {
    showImportDialog.value = false
    importData.value = ''
  } else {
    importError.value = 'Format JSON invalide'
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Sauvegardes</h2>

    <!-- No localStorage Warning -->
    <div v-if="!hasLocalStorage" class="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
      <p class="text-yellow-800">
        Le stockage local n'est pas disponible. Les sauvegardes ne fonctionneront pas.
      </p>
    </div>

    <div v-else>
      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          @click="openSaveDialog"
          class="px-4 py-2 bg-transparent hover:bg-gray-50 text-gray-800 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 border border-gray-800"
        >
          <Save :size="16" class="text-blue-600" />
          Sauvegarder l'état actuel
        </button>

        <button
          v-if="savedStatesStore.savedStates.length > 0"
          @click="handleExport"
          class="px-4 py-2 bg-transparent hover:bg-gray-50 text-gray-800 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 border border-gray-800"
        >
          <Download :size="16" class="text-blue-600" />
          Exporter tout
        </button>

        <button
          @click="showImportDialog = true"
          class="px-4 py-2 bg-transparent hover:bg-gray-50 text-gray-800 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 border border-gray-800"
        >
          <Upload :size="16" class="text-blue-600" />
          Importer
        </button>

        <button
          v-if="savedStatesStore.savedStates.length > 0"
          @click="savedStatesStore.clearAllStates()"
          class="px-4 py-2 bg-transparent hover:bg-gray-50 text-gray-800 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 border border-gray-800"
        >
          <Trash2 :size="16" class="text-red-600" />
          Tout supprimer
        </button>
      </div>

      <!-- Share Link -->
      <div class="mb-6">
        <ShareLink />
      </div>

      <!-- Empty State -->
      <div
        v-if="sortedStates.length === 0"
        class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg"
      >
        <p class="text-sm">Aucune sauvegarde</p>
        <p class="text-xs mt-1">Cliquez sur "Sauvegarder" pour créer votre première sauvegarde</p>
      </div>

      <!-- Saved States List -->
      <div v-else class="space-y-2">
        <div
          v-for="state in sortedStates"
          :key="state.name"
          class="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          :class="{
            'border-blue-500 bg-blue-50': state.name === savedStatesStore.currentStateName
          }"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800">{{ state.name }}</h3>
              <div class="text-xs text-gray-600 mt-1">
                <span>Année: {{ state.year }}</span>
                <span class="mx-2">•</span>
                <span>{{ formatDate(state.savedAt) }}</span>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="handleLoad(state.name)"
                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                title="Charger cette sauvegarde"
              >
                Charger
              </button>
              <button
                @click="handleDelete(state.name)"
                class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                title="Supprimer cette sauvegarde"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Dialog -->
    <div
      v-if="showSaveDialog"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      @click.self="showSaveDialog = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Sauvegarder l'état actuel</h3>

        <label for="save-name-input" class="block text-sm font-medium text-gray-700 mb-2">
          Nom de la sauvegarde
        </label>
        <input
          id="save-name-input"
          v-model="saveName"
          type="text"
          placeholder="Ex: Scenario 1, Test SASU, etc."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keyup.enter="handleSave"
          autofocus
        />

        <p class="text-xs text-gray-600 mt-2">
          Si une sauvegarde avec ce nom existe déjà, elle sera écrasée.
        </p>

        <div class="flex gap-3 mt-6">
          <button
            @click="handleSave"
            :disabled="!saveName.trim()"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            Sauvegarder
          </button>
          <button
            @click="showSaveDialog = false"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Import Dialog -->
    <div
      v-if="showImportDialog"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      @click.self="showImportDialog = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Importer des sauvegardes</h3>

        <label for="import-data-textarea" class="block text-sm font-medium text-gray-700 mb-2">
          Collez le JSON exporté
        </label>
        <textarea
          id="import-data-textarea"
          v-model="importData"
          rows="10"
          placeholder='[{"name": "...", "year": 2018, ...}]'
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs"
        ></textarea>

        <p v-if="importError" class="text-sm text-red-600 mt-2">{{ importError }}</p>

        <div class="flex gap-3 mt-6">
          <button
            @click="handleImport"
            :disabled="!importData.trim()"
            class="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            Importer
          </button>
          <button
            @click="
              showImportDialog = false;
              importData = '';
              importError = '';
            "
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
