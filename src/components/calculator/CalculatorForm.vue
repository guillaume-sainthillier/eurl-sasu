<script setup lang="ts">
import { computed } from 'vue'
import { useCalculation } from '@/composables/useCalculation'
import InputSlider from './InputSlider.vue'
import HelpIcon from '../common/HelpIcon.vue'

const { params, updateParam, availableFeatures } = useCalculation()

const isSASU = computed(() => params.value.forme.value === 'SASU')
const isEURL = computed(() => params.value.forme.value === 'EURL')

// PFU is only available for SASU in 2018+
const canUsePFU = computed(() => {
  return isSASU.value && availableFeatures.value?.hasFlatTax
})

function toggleCheckbox(paramName: string) {
  const currentValue = params.value[paramName as keyof typeof params.value].value
  updateParam(paramName, currentValue ? 0 : 1)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">Paramètres</h2>

    <!-- Company Form Selection -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <label class="block text-sm font-medium text-gray-700 mb-3">Forme juridique</label>
      <div class="flex gap-4">
        <label for="forme-eurl" class="flex items-center cursor-pointer">
          <input
            id="forme-eurl"
            type="radio"
            name="forme"
            value="EURL"
            :checked="isEURL"
            @change="updateParam('forme', 'EURL')"
            class="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span class="ml-2 text-gray-700">EURL</span>
        </label>
        <label for="forme-sasu" class="flex items-center cursor-pointer">
          <input
            id="forme-sasu"
            type="radio"
            name="forme"
            value="SASU"
            :checked="isSASU"
            @change="updateParam('forme', 'SASU')"
            class="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span class="ml-2 text-gray-700">SASU</span>
        </label>
      </div>
    </div>

    <!-- Revenue and Expenses -->
    <div class="space-y-1">
      <h3 class="text-lg font-medium text-gray-700 mb-3">Chiffre d'affaires et charges</h3>

      <InputSlider
        label="Chiffre d'affaires (CA)"
        :model-value="params.ca.value"
        :min="params.ca.min"
        :max="params.ca.max"
        :step="params.ca.step"
        help-key="ca"
        @update:model-value="(v) => updateParam('ca', v)"
      />

      <InputSlider
        label="Charges"
        :model-value="params.charges.value"
        :min="params.charges.min"
        :max="params.charges.max"
        :step="params.charges.step"
        help-key="charges"
        @update:model-value="(v) => updateParam('charges', v)"
      />

      <InputSlider
        label="Capital"
        :model-value="params.capital.value"
        :min="params.capital.min"
        :max="params.capital.max"
        :step="params.capital.step"
        help-key="capital"
        @update:model-value="(v) => updateParam('capital', v)"
      />

      <InputSlider
        label="Nombre de mois"
        :model-value="params.nbMois.value"
        :min="params.nbMois.min"
        :max="params.nbMois.max"
        :step="params.nbMois.step"
        suffix="mois"
        help-key="nbMois"
        @update:model-value="(v) => updateParam('nbMois', v)"
      />
    </div>

    <!-- Remuneration and Dividends -->
    <div class="mt-6 space-y-1">
      <h3 class="text-lg font-medium text-gray-700 mb-3">Rémunération et dividendes</h3>

      <InputSlider
        label="Rémunération nette"
        :model-value="params.remuneration.value"
        :min="params.remuneration.min"
        :max="params.remuneration.max"
        :step="params.remuneration.step"
        help-key="remuneration"
        @update:model-value="(v) => updateParam('remuneration', v)"
      />

      <InputSlider
        label="Dividendes brut"
        :model-value="params.dividendes.value"
        :min="params.dividendes.min"
        :max="params.dividendes.max"
        :step="params.dividendes.step"
        help-key="dividendes"
        @update:model-value="(v) => updateParam('dividendes', v)"
      />
    </div>

    <!-- Other Income -->
    <div class="mt-6 space-y-1">
      <h3 class="text-lg font-medium text-gray-700 mb-3">Autres revenus</h3>

      <InputSlider
        label="Autres revenus"
        :model-value="params.autresRevenus.value"
        :min="params.autresRevenus.min"
        :max="params.autresRevenus.max"
        :step="params.autresRevenus.step"
        help-key="autresRevenus"
        @update:model-value="(v) => updateParam('autresRevenus', v)"
      />

      <InputSlider
        label="BNC (Bénéfices Non Commerciaux)"
        :model-value="params.bnc.value"
        :min="params.bnc.min"
        :max="params.bnc.max"
        :step="params.bnc.step"
        help-key="bnc"
        @update:model-value="(v) => updateParam('bnc', v)"
      />
    </div>

    <!-- Tax Options -->
    <div class="mt-6 space-y-1">
      <h3 class="text-lg font-medium text-gray-700 mb-3">Options fiscales</h3>

      <InputSlider
        label="Nombre de parts fiscales"
        :model-value="params.nbParts.value"
        :min="params.nbParts.min"
        :max="params.nbParts.max"
        :step="params.nbParts.step"
        suffix="parts"
        help-key="nbParts"
        @update:model-value="(v) => updateParam('nbParts', v)"
      />
    </div>

    <!-- Checkboxes -->
    <div class="mt-6 space-y-3">
      <h3 class="text-lg font-medium text-gray-700 mb-3">Options</h3>

      <!-- ACCRE -->
      <label v-if="availableFeatures?.hasAccre" for="accre-checkbox" class="flex items-center cursor-pointer">
        <input
          id="accre-checkbox"
          type="checkbox"
          :checked="Boolean(params.accre.value)"
          @change="toggleCheckbox('accre')"
          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <span class="ml-2 text-gray-700 flex items-center">
          ACCRE (Aide à la Création ou Reprise d'Entreprise)
          <HelpIcon field-key="accre" />
        </span>
      </label>

      <!-- Pension Fund Selection (EURL only, 2018+) -->
      <div v-if="isEURL && availableFeatures?.hasPensionFundSelection" class="ml-6">
        <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          Caisse de retraite
          <HelpIcon field-key="caisseRetraite" />
        </label>
        <div class="flex gap-4">
          <label for="caisse-cipav" class="flex items-center cursor-pointer">
            <input
              id="caisse-cipav"
              type="radio"
              name="caisseRetraite"
              value="CIPAV"
              :checked="params.caisseRetraite.value === 'CIPAV'"
              @change="updateParam('caisseRetraite', 'CIPAV')"
              class="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">CIPAV</span>
          </label>
          <label for="caisse-ssi" class="flex items-center cursor-pointer">
            <input
              id="caisse-ssi"
              type="radio"
              name="caisseRetraite"
              value="SSI"
              :checked="params.caisseRetraite.value === 'SSI'"
              @change="updateParam('caisseRetraite', 'SSI')"
              class="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">SSI</span>
          </label>
        </div>
      </div>

      <!-- Flat Tax (SASU only, 2018+) -->
      <label v-if="canUsePFU" for="pfu-checkbox" class="flex items-center cursor-pointer">
        <input
          id="pfu-checkbox"
          type="checkbox"
          :checked="Boolean(params.pfu.value)"
          @change="toggleCheckbox('pfu')"
          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <span class="ml-2 text-gray-700 flex items-center">
          Flat Tax (PFU - 30%)
          <HelpIcon field-key="pfu" />
        </span>
      </label>

      <!-- ZFU (2018+) -->
      <label v-if="availableFeatures?.hasZfuExemption" for="zfu-checkbox" class="flex items-center cursor-pointer">
        <input
          id="zfu-checkbox"
          type="checkbox"
          :checked="Boolean(params.zfu.value)"
          @change="toggleCheckbox('zfu')"
          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <span class="ml-2 text-gray-700 flex items-center">
          ZFU (Zone Franche Urbaine)
          <HelpIcon field-key="zfu" />
        </span>
      </label>
    </div>
  </div>
</template>
