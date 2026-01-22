<script setup lang="ts">
import { computed } from 'vue'
import HelpIcon from '../common/HelpIcon.vue'

interface Props {
  label: string
  modelValue: number
  min: number
  max: number
  step: number
  suffix?: string
  helpKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  suffix: '€'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit('update:modelValue', value)
})

const formattedValue = computed(() => {
  return new Intl.NumberFormat('fr-FR').format(props.modelValue)
})
</script>

<template>
  <div class="mb-4">
    <div class="flex justify-between items-center mb-2">
      <label class="text-sm font-medium text-gray-700 flex items-center">
        {{ label }}
        <HelpIcon v-if="helpKey" :field-key="helpKey" />
      </label>
      <span class="text-sm font-mono font-semibold text-blue-600">
        {{ formattedValue }} {{ suffix }}
      </span>
    </div>

    <div class="flex gap-3 items-center">
      <input
        v-model.number="localValue"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
      />
      <input
        v-model.number="localValue"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        class="w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>
</template>
