<script setup lang="ts">
import { Check, Copy, Link } from 'lucide-vue-next'
import { ref } from 'vue'
import { useUrlState } from '@/composables/useUrlState'
import BaseModal from '../common/BaseModal.vue'

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
        <button type="button" class="btn btn-secondary w-full" @click="openShareDialog">
            <Link :size="16" />
            Partager un lien
        </button>

        <!-- Share Dialog -->
        <BaseModal :open="showDialog" title="Partager ce calcul" size="2xl" @close="showDialog = false">
            <label for="share-url-input" class="block text-sm text-gray-600 mb-2">
                Copiez ce lien pour partager votre configuration actuelle :
            </label>

            <div class="flex gap-2">
                <input
                    id="share-url-input"
                    :value="shareUrl"
                    readonly
                    class="form-control flex-1 text-sm font-mono"
                    @focus="($event.target as HTMLInputElement).select()"
                >
                <button
                    type="button"
                    class="btn whitespace-nowrap"
                    :class="copied ? 'btn-success' : 'btn-primary'"
                    @click="handleCopy"
                >
                    <Check v-if="copied" :size="16" />
                    <Copy v-else :size="16" />
                    {{ copied ? 'Copié !' : 'Copier' }}
                </button>
            </div>
            <p class="sr-only" aria-live="polite">
                {{ copied ? 'Lien copié dans le presse-papiers' : '' }}
            </p>

            <p class="text-xs text-gray-500 mt-3">
                Le lien contient tous vos paramètres actuels (année, CA, charges, rémunération, etc.)
            </p>

            <template #footer>
                <button type="button" class="btn btn-secondary ml-auto" @click="showDialog = false">Fermer</button>
            </template>
        </BaseModal>
    </div>
</template>
