<script setup lang="ts">
import { Lightbulb } from 'lucide-vue-next'
import { ref } from 'vue'
import { helpContent } from '@/config/helpContent'
import BaseModal from './BaseModal.vue'

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
      class="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 cursor-pointer transition-colors duration-150 hover:bg-blue-200 hover:text-blue-700 active:bg-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 motion-reduce:transition-none"
      type="button"
      :title="`Aide: ${content?.title || 'Information'}`"
      :aria-label="`Aide: ${content?.title || 'Information'}`"
    >
      <span class="text-xs font-bold" aria-hidden="true">?</span>
    </button>

    <BaseModal
      v-if="content"
      :open="showModal"
      :title="content.title"
      size="lg"
      @close="showModal = false"
    >
      <div class="space-y-3 text-sm">
        <p class="text-gray-700">{{ content.description }}</p>

        <div v-if="content.additionalInfo" class="text-gray-600 bg-blue-50 p-3 rounded flex gap-2 items-center">
          <Lightbulb :size="16" class="text-blue-600 flex-shrink-0 mt-0.5" />
          <span>{{ content.additionalInfo }}</span>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-primary ml-auto" @click="showModal = false">Fermer</button>
      </template>
    </BaseModal>
  </div>
</template>
