<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

interface Props {
    open: boolean
    title: string
    size?: 'md' | 'lg' | '2xl' | '4xl'
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
})

const emit = defineEmits<(e: 'close') => void>()

const titleId = useId()
const panel = ref<HTMLElement | null>(null)
let previouslyFocused: HTMLElement | null = null

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
}

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function focusableElements(): HTMLElement[] {
    return panel.value ? [...panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)] : []
}

function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        event.stopPropagation()
        emit('close')
        return
    }

    // Keep keyboard focus inside the dialog
    if (event.key === 'Tab') {
        const elements = focusableElements()
        if (elements.length === 0) {
            event.preventDefault()
            return
        }
        const first = elements[0]
        const last = elements[elements.length - 1]
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
        }
    }
}

watch(
    () => props.open,
    async (open) => {
        if (open) {
            previouslyFocused = document.activeElement as HTMLElement | null
            document.body.style.overflow = 'hidden'
            await nextTick()
            // Focus the field marked autofocus, otherwise the first focusable element
            const target =
                panel.value?.querySelector<HTMLElement>('[autofocus]') ?? focusableElements()[0] ?? panel.value
            target?.focus()
        } else {
            document.body.style.overflow = ''
            previouslyFocused?.focus()
            previouslyFocused = null
        }
    }
)

onBeforeUnmount(() => {
    if (props.open) {
        document.body.style.overflow = ''
    }
})
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
            enter-from-class="opacity-0"
            leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
            leave-to-class="opacity-0"
        >
            <div
                v-if="open"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
                @click.self="emit('close')"
            >
                <div
                    ref="panel"
                    role="dialog"
                    aria-modal="true"
                    :aria-labelledby="titleId"
                    tabindex="-1"
                    class="flex max-h-[90vh] w-full flex-col rounded-xl bg-white shadow-2xl focus:outline-none"
                    :class="sizeClasses[size]"
                    @keydown="onKeydown"
                >
                    <div class="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
                        <h2 :id="titleId" class="text-lg font-semibold text-gray-800">{{ title }}</h2>
                        <button type="button" class="btn-icon -mr-2 -mt-1" aria-label="Fermer" @click="emit('close')">
                            <X :size="20" />
                        </button>
                    </div>

                    <div class="overflow-y-auto px-6 py-4">
                        <slot />
                    </div>

                    <div v-if="$slots.footer" class="flex gap-3 border-t border-gray-200 px-6 py-4">
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
