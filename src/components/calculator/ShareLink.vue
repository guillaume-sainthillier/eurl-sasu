<script setup lang="ts">
import { ref } from 'vue'
import { useUrlState } from '@/composables/useUrlState'

const { encodeStateToUrl, copyShareableLink } = useUrlState()

const showDialog = ref(false)
const shareUrl = ref('')
const copied = ref(false)

function openShareDialog() {
  shareUrl.value = encodeStateToUrl()
  showDialog.value = true
  copied.value = false
}

async function handleCopy() {
  const success = await copyShareableLink()
  if (success) {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<template>
  <div>
    <!-- Share Button -->
    <button
      @click="openShareDialog"
      class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
    >
      🔗 Partager un lien
    </button>

    <!-- Share Dialog -->
    <div
      v-if="showDialog"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      @click.self="showDialog = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Partager ce calcul</h3>

        <p class="text-sm text-gray-600 mb-4">
          Copiez ce lien pour partager votre configuration actuelle :
        </p>

        <div class="flex gap-2 mb-4">
          <input
            :value="shareUrl"
            readonly
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
            @focus="($event.target as HTMLInputElement).select()"
          />
          <button
            @click="handleCopy"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap"
            :class="{ 'bg-green-600 hover:bg-green-600': copied }"
          >
            {{ copied ? '✓ Copié !' : '📋 Copier' }}
          </button>
        </div>

        <p class="text-xs text-gray-500 mb-4">
          Le lien contient tous vos paramètres actuels (année, CA, charges, rémunération, etc.)
        </p>

        <div class="flex justify-end">
          <button
            @click="showDialog = false"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
