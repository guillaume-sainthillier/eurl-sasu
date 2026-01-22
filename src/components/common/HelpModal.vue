<script setup lang="ts">
import { ref } from 'vue'
import { HelpCircle } from 'lucide-vue-next'

const showModal = ref(false)

defineExpose({
  open: () => (showModal.value = true),
  close: () => (showModal.value = false)
})
</script>

<template>
  <div>
    <!-- Help Button (can be placed in header) -->
    <button
      @click="showModal = true"
      class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
      title="Aide et documentation"
    >
      <HelpCircle :size="16" />
      Aide
    </button>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      @click.self="showModal = false"
    >
      <div class="bg-white rounded-lg max-w-4xl w-full my-8 flex flex-col max-h-[90vh]">
        <!-- Fixed Header -->
        <div class="flex justify-between items-start p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-800">Aide et Documentation</h2>
          <button
            @click="showModal = false"
            class="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto p-6 space-y-6 text-sm">
          <!-- General Info -->
          <section>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">À propos</h3>
            <p class="text-gray-700">
              Ce calculateur vous permet de comparer les revenus nets entre EURL et SASU pour les
              années fiscales 2017 et 2018, en tenant compte de toutes les charges sociales et
              fiscales françaises.
            </p>
          </section>

          <!-- Parameters -->
          <section>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Paramètres</h3>
            <dl class="space-y-3">
              <div>
                <dt class="font-medium text-gray-800">Chiffre d'affaires (CA)</dt>
                <dd class="text-gray-600 mt-1">
                  Montant total des ventes ou prestations de services de votre entreprise sur
                  l'exercice.
                </dd>
              </div>

              <div>
                <dt class="font-medium text-gray-800">Charges</dt>
                <dd class="text-gray-600 mt-1">
                  Total des charges déductibles (loyer, fournitures, abonnements, etc.) hors
                  rémunération et cotisations sociales.
                </dd>
              </div>

              <div>
                <dt class="font-medium text-gray-800">Capital</dt>
                <dd class="text-gray-600 mt-1">
                  Capital social de votre société. Utilisé pour calculer le seuil de cotisations
                  sociales sur les dividendes en EURL.
                </dd>
              </div>

              <div>
                <dt class="font-medium text-gray-800">Nombre de mois</dt>
                <dd class="text-gray-600 mt-1">
                  Durée de l'exercice fiscal. Permet de prendre en compte les exercices partiels
                  (création d'entreprise en cours d'année, etc.).
                </dd>
              </div>

              <div>
                <dt class="font-medium text-gray-800">Rémunération nette</dt>
                <dd class="text-gray-600 mt-1">
                  Montant net que vous souhaitez vous verser en tant que dirigeant. Les cotisations
                  sociales seront calculées et ajoutées automatiquement.
                </dd>
              </div>

              <div>
                <dt class="font-medium text-gray-800">Dividendes brut</dt>
                <dd class="text-gray-600 mt-1">
                  Montant des dividendes que vous souhaitez vous distribuer. Les cotisations
                  sociales et prélèvements fiscaux seront calculés selon votre forme juridique.
                </dd>
              </div>

              <div>
                <dt class="font-medium text-gray-800">Autres revenus</dt>
                <dd class="text-gray-600 mt-1">
                  Revenus salariaux ou autres revenus imposables perçus hors de votre société
                  (salaire d'un autre emploi, pensions, etc.). Impacte le calcul de l'IR.
                </dd>
              </div>

              <div>
                <dt class="font-medium text-gray-800">BNC (Bénéfices Non Commerciaux)</dt>
                <dd class="text-gray-600 mt-1">
                  Revenus de professions libérales en nom propre (auto-entrepreneur, etc.). Un
                  abattement forfaitaire de 34% est appliqué pour l'IR.
                </dd>
              </div>

              <div>
                <dt class="font-medium text-gray-800">Nombre de parts fiscales</dt>
                <dd class="text-gray-600 mt-1">
                  Nombre de parts de votre foyer fiscal (célibataire: 1, couple: 2, enfants: +0.5
                  par enfant jusqu'au 2ème, +1 à partir du 3ème). Affecte le calcul de l'IR.
                </dd>
              </div>
            </dl>
          </section>

          <!-- Options -->
          <section>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Options fiscales</h3>
            <dl class="space-y-3">
              <div>
                <dt class="font-medium text-gray-800">ACCRE</dt>
                <dd class="text-gray-600 mt-1">
                  Aide à la Création ou Reprise d'Entreprise. Réduit les cotisations sociales
                  pendant la première année d'activité.
                </dd>
              </div>

              <div>
                <dt class="font-medium text-gray-800">Caisse de retraite (EURL 2018+)</dt>
                <dd class="text-gray-600 mt-1">
                  Choix entre CIPAV (professions libérales) et SSI (commerçants/artisans). Les
                  taux de cotisation diffèrent selon la caisse.
                </dd>
              </div>

              <div>
                <dt class="font-medium text-gray-800">Flat Tax / PFU (SASU 2018+)</dt>
                <dd class="text-gray-600 mt-1">
                  Prélèvement Forfaitaire Unique (30%) sur les dividendes. Alternative au barème
                  progressif de l'IR pour les dividendes.
                </dd>
              </div>

              <div>
                <dt class="font-medium text-gray-800">ZFU (2018+)</dt>
                <dd class="text-gray-600 mt-1">
                  Zone Franche Urbaine. Exonération partielle ou totale d'Impôt sur les Sociétés
                  selon l'implantation géographique.
                </dd>
              </div>
            </dl>
          </section>

          <!-- EURL vs SASU -->
          <section>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">EURL vs SASU</h3>
            <div class="space-y-3">
              <div>
                <h4 class="font-medium text-gray-800">EURL (Entreprise Unipersonnelle à Responsabilité Limitée)</h4>
                <ul class="list-disc list-inside text-gray-600 mt-1 space-y-1">
                  <li>Gérant majoritaire = Travailleur Non Salarié (TNS)</li>
                  <li>Cotisations sociales ~45% du net sur la rémunération</li>
                  <li>Dividendes: cotisations sociales sur la part > 10% du capital</li>
                  <li>Caisse de retraite: CIPAV ou SSI (2018+)</li>
                </ul>
              </div>

              <div>
                <h4 class="font-medium text-gray-800">SASU (Société par Actions Simplifiée Unipersonnelle)</h4>
                <ul class="list-disc list-inside text-gray-600 mt-1 space-y-1">
                  <li>Président = Assimilé Salarié</li>
                  <li>Cotisations sociales ~82% du net sur la rémunération</li>
                  <li>Dividendes: 17.2% de prélèvements sociaux uniquement</li>
                  <li>Option PFU (Flat Tax 30%) possible en 2018+</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Calculations -->
          <section>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Détails des calculs</h3>
            <div class="text-gray-600 space-y-2">
              <p>
                <strong>IS (Impôt sur les Sociétés):</strong> Calculé sur le bénéfice de
                l'entreprise après déduction des charges, rémunération et cotisations sociales.
              </p>
              <p>
                <strong>IR (Impôt sur le Revenu):</strong> Calculé sur l'ensemble de vos revenus
                imposables (rémunération + dividendes + autres revenus + BNC) selon le barème
                progressif avec le quotient familial.
              </p>
              <p>
                <strong>Revenu net total:</strong> CA - Charges - Cotisations sociales - IS - IR
              </p>
            </div>
          </section>

          <!-- Features -->
          <section>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Fonctionnalités</h3>
            <ul class="list-disc list-inside text-gray-600 space-y-1">
              <li><strong>Sauvegardes:</strong> Enregistrez vos scénarios avec un nom personnalisé</li>
              <li><strong>Export/Import:</strong> Partagez vos sauvegardes au format JSON</li>
              <li><strong>Partage de lien:</strong> Générez un lien URL avec tous vos paramètres</li>
              <li><strong>Détails complets:</strong> Consultez le détail de chaque calcul (IS, IR, cotisations)</li>
            </ul>
          </section>
        </div>

        <!-- Fixed Footer -->
        <div class="p-6 border-t border-gray-200 flex justify-end">
          <button
            @click="showModal = false"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
