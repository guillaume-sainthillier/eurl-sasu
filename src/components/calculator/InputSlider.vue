<script setup lang="ts">
import { computed, useId } from 'vue'
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
    suffix: '€',
})

const emit = defineEmits<(e: 'update:modelValue', value: number) => void>()

const localValue = computed({
    get: () => props.modelValue,
    set: (value: number) => emit('update:modelValue', value),
})

const inputId = useId()

const formattedValue = computed(() => {
    return new Intl.NumberFormat('fr-FR').format(props.modelValue)
})
</script>

<template>
    <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
            <div class="flex items-center">
                <label :for="inputId" class="text-sm font-medium text-gray-700">{{ label }}</label>
                <HelpIcon v-if="helpKey" :field-key="helpKey" />
            </div>
            <span class="text-sm font-mono font-semibold text-blue-600"> {{ formattedValue }} {{ suffix }} </span>
        </div>

        <div class="flex gap-3 items-center">
            <input
                v-model.number="localValue"
                type="range"
                :min="min"
                :max="max"
                :step="step"
                class="form-range flex-1"
                :aria-label="label"
            >
            <input
                :id="inputId"
                v-model.number="localValue"
                type="number"
                :min="min"
                :max="max"
                :step="step"
                class="form-control w-32 text-sm"
            >
        </div>
    </div>
</template>
