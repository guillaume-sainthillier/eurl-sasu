<script setup lang="ts">
import { ref } from 'vue'
import { helpContent } from '@/config/helpContent'
import { Lightbulb } from 'lucide-vue-next'

interface Props {
  fieldKey: string
}

const props = defineProps<Props>()
const showModal = ref(false)

const content = helpContent[props.fieldKey]
</script>

<template>
  <div class="inline-block">
    <!-- Help Icon Button -->
    <button
      @click.stop="showModal = true"
      class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors ml-1"
      type="button"
      :title="`Aide: ${content?.title || 'Information'}`"
      aria-label="Aide"
    >
      <span class="text-xs font-bold">?</span>
    </button>

    <!-- Field-Specific Modal (Teleported to body) -->
    <Teleport to="body">
      <div
        v-if="showModal && content"
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        @click.self="showModal = false"
        @keyup.esc="showModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl" @click.stop>
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-gray-800">{{ content.title }}</h3>
            <button
              @click.stop="showModal = false"
              class="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              type="button"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          <div class="space-y-3 text-sm">
            <p class="text-gray-700">{{ content.description }}</p>

            <div v-if="content.additionalInfo" class="text-gray-600 bg-blue-50 p-3 rounded flex gap-2 items-center">
              <Lightbulb :size="16" class="text-blue-600 flex-shrink-0 mt-0.5" />
              <span>{{ content.additionalInfo }}</span>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              @click.stop="showModal = false"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              type="button"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
