<script setup lang="ts">
import { Download, Save, Trash2, Upload } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useCalculatorStore } from '@/stores/calculator'
import { useSavedStatesStore } from '@/stores/savedStates'
import { formatDate } from '@/utils/formatters'
import BaseModal from '../common/BaseModal.vue'
import ShareLink from './ShareLink.vue'

const savedStatesStore = useSavedStatesStore()
const calculatorStore = useCalculatorStore()

const showSaveDialog = ref(false)
const showImportDialog = ref(false)
const saveName = ref('')
const importData = ref('')
const importError = ref('')
const isDragging = ref(false)

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

function closeImportDialog() {
  showImportDialog.value = false
  importData.value = ''
  importError.value = ''
  isDragging.value = false
}

function handleImport() {
  importError.value = ''
  if (!importData.value.trim()) {
    importError.value = 'Veuillez coller des données JSON valides ou sélectionner un fichier'
    return
  }

  const success = savedStatesStore.importStates(importData.value)
  if (success) {
    closeImportDialog()
  } else {
    importError.value = 'Format JSON invalide'
  }
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    processFile(file)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false

  const file = event.dataTransfer?.files[0]
  if (file) {
    processFile(file)
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function processFile(file: File) {
  if (!file.name.endsWith('.json')) {
    importError.value = 'Veuillez sélectionner un fichier JSON (.json)'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    importData.value = content
    importError.value = ''
  }
  reader.onerror = () => {
    importError.value = 'Erreur lors de la lecture du fichier'
  }
  reader.readAsText(file)
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
        <button type="button" class="btn btn-outline btn-sm" @click="openSaveDialog">
          <Save :size="16" class="text-blue-600" />
          Sauvegarder l'état actuel
        </button>

        <button
          v-if="savedStatesStore.savedStates.length > 0"
          type="button"
          class="btn btn-outline btn-sm"
          @click="handleExport"
        >
          <Download :size="16" class="text-blue-600" />
          Exporter tout
        </button>

        <button type="button" class="btn btn-outline btn-sm" @click="showImportDialog = true">
          <Upload :size="16" class="text-blue-600" />
          Importer
        </button>

        <button
          v-if="savedStatesStore.savedStates.length > 0"
          type="button"
          class="btn btn-outline btn-sm hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-500"
          @click="savedStatesStore.clearAllStates()"
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
      <ul v-else class="space-y-2">
        <li
          v-for="state in sortedStates"
          :key="state.name"
          class="p-4 border rounded-lg transition-colors"
          :class="
            state.name === savedStatesStore.currentStateName
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200'
          "
          :aria-current="state.name === savedStatesStore.currentStateName ? 'true' : undefined"
        >
          <div class="flex justify-between items-center gap-3">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-800 truncate">{{ state.name }}</h3>
              <div class="text-xs text-gray-600 mt-1">
                <span>Année: {{ state.year }}</span>
                <span class="mx-2" aria-hidden="true">•</span>
                <span>{{ formatDate(state.savedAt) }}</span>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button
                type="button"
                class="btn btn-primary btn-sm"
                :aria-label="`Charger la sauvegarde ${state.name}`"
                @click="handleLoad(state.name)"
              >
                Charger
              </button>
              <button
                type="button"
                class="btn-icon btn-danger-ghost"
                :title="`Supprimer la sauvegarde ${state.name}`"
                :aria-label="`Supprimer la sauvegarde ${state.name}`"
                @click="handleDelete(state.name)"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Save Dialog -->
    <BaseModal :open="showSaveDialog" title="Sauvegarder l'état actuel" @close="showSaveDialog = false">
      <label for="save-name-input" class="block text-sm font-medium text-gray-700 mb-2">
        Nom de la sauvegarde
      </label>
      <input
        id="save-name-input"
        v-model="saveName"
        type="text"
        placeholder="Ex: Scenario 1, Test SASU, etc."
        class="form-control"
        @keyup.enter="handleSave"
        autofocus
      />

      <p class="text-xs text-gray-600 mt-2">
        Si une sauvegarde avec ce nom existe déjà, elle sera écrasée.
      </p>

      <template #footer>
        <button type="button" class="btn btn-secondary flex-1" @click="showSaveDialog = false">
          Annuler
        </button>
        <button
          type="button"
          class="btn btn-primary flex-1"
          :disabled="!saveName.trim()"
          @click="handleSave"
        >
          Sauvegarder
        </button>
      </template>
    </BaseModal>

    <!-- Import Dialog -->
    <BaseModal
      :open="showImportDialog"
      title="Importer des sauvegardes"
      size="2xl"
      @close="closeImportDialog"
    >
      <!-- Drag & Drop Zone -->
      <div
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        class="mb-4 p-8 border-2 border-dashed rounded-lg transition-colors"
        :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'"
      >
        <div class="text-center">
          <Upload :size="32" class="mx-auto mb-2 text-gray-400" />
          <p class="text-sm font-medium text-gray-700 mb-1">
            Glissez-déposez votre fichier JSON ici
          </p>
          <p class="text-xs text-gray-500 mb-3">ou</p>
          <!-- Visually hidden but focusable: the label shows the focus ring -->
          <input
            id="import-file-input"
            type="file"
            accept=".json"
            @change="handleFileSelect"
            class="peer sr-only"
          />
          <label
            for="import-file-input"
            class="btn btn-primary btn-sm peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2"
          >
            Sélectionner un fichier
          </label>
        </div>
      </div>

      <div class="relative flex items-center justify-center my-4">
        <div class="border-t border-gray-300 flex-grow"></div>
        <span class="px-3 text-xs text-gray-500 bg-white">OU</span>
        <div class="border-t border-gray-300 flex-grow"></div>
      </div>

      <!-- Text Input Option -->
      <div>
        <label for="import-data-textarea" class="block text-sm font-medium text-gray-700 mb-2">
          Coller le JSON exporté
        </label>
        <textarea
          id="import-data-textarea"
          v-model="importData"
          rows="10"
          placeholder='[{"name": "...", "year": 2018, ...}]'
          class="form-control font-mono text-xs"
          :aria-invalid="importError ? 'true' : undefined"
          aria-describedby="import-error"
        ></textarea>
      </div>

      <p v-if="importError" id="import-error" role="alert" class="text-sm text-red-600 mt-2">
        {{ importError }}
      </p>

      <template #footer>
        <button type="button" class="btn btn-secondary flex-1" @click="closeImportDialog">
          Annuler
        </button>
        <button
          type="button"
          class="btn btn-primary flex-1"
          :disabled="!importData.trim()"
          @click="handleImport"
        >
          Importer
        </button>
      </template>
    </BaseModal>
  </div>
</template>
