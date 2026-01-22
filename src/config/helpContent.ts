/**
 * Field-specific help documentation
 */

export interface HelpContent {
  title: string
  description: string
  additionalInfo?: string
}

export const helpContent: Record<string, HelpContent> = {
  ca: {
    title: 'Chiffre d\'affaires (CA)',
    description: 'Montant total des ventes ou prestations de services de votre entreprise sur l\'exercice.',
    additionalInfo: 'Le CA est le revenu brut de votre société avant déduction de toutes charges.'
  },

  charges: {
    title: 'Charges',
    description: 'Total des charges déductibles (loyer, fournitures, abonnements, etc.) hors rémunération et cotisations sociales.',
    additionalInfo: 'Ne pas inclure votre rémunération ni les cotisations sociales qui seront calculées automatiquement.'
  },

  capital: {
    title: 'Capital',
    description: 'Capital social de votre société. Utilisé pour calculer le seuil de cotisations sociales sur les dividendes en EURL.',
    additionalInfo: 'En EURL, les dividendes au-delà de 10% du capital sont soumis à des cotisations sociales élevées (45%).'
  },

  nbMois: {
    title: 'Nombre de mois',
    description: 'Durée de l\'exercice fiscal. Permet de prendre en compte les exercices partiels (création d\'entreprise en cours d\'année, etc.).',
    additionalInfo: 'Un exercice normal est de 12 mois. Ajustez pour les exercices partiels.'
  },

  remuneration: {
    title: 'Rémunération nette',
    description: 'Montant net que vous souhaitez vous verser en tant que dirigeant. Les cotisations sociales seront calculées et ajoutées automatiquement.',
    additionalInfo: 'En EURL: ~45% de cotisations sociales. En SASU: ~82% de cotisations sociales (ou ~35% avec ACCRE).'
  },

  dividendes: {
    title: 'Dividendes brut',
    description: 'Montant des dividendes que vous souhaitez vous distribuer. Les cotisations sociales et prélèvements fiscaux seront calculés selon votre forme juridique.',
    additionalInfo: 'EURL: cotisations sur la part > 10% du capital. SASU: 17.2% de prélèvements sociaux + option PFU.'
  },

  autresRevenus: {
    title: 'Autres revenus',
    description: 'Revenus salariaux ou autres revenus imposables perçus hors de votre société (salaire d\'un autre emploi, pensions, etc.). Impacte le calcul de l\'IR.',
    additionalInfo: 'Un abattement de 10% est appliqué automatiquement pour les revenus salariaux.'
  },

  bnc: {
    title: 'BNC (Bénéfices Non Commerciaux)',
    description: 'Revenus de professions libérales en nom propre (auto-entrepreneur, etc.). Un abattement forfaitaire de 34% est appliqué pour l\'IR.',
    additionalInfo: 'L\'abattement de 34% correspond aux frais professionnels forfaitaires.'
  },

  nbParts: {
    title: 'Nombre de parts fiscales',
    description: 'Nombre de parts de votre foyer fiscal. Affecte le calcul de l\'IR.',
    additionalInfo: 'Célibataire: 1 part, couple: 2 parts, enfants: +0.5 par enfant jusqu\'au 2ème, +1 à partir du 3ème.'
  },

  accre: {
    title: 'ACCRE',
    description: 'Aide à la Création ou Reprise d\'Entreprise. Réduit les cotisations sociales pendant la première année d\'activité.',
    additionalInfo: 'SASU: réduit les cotisations de ~82% à ~35% du net. EURL: réduction progressive sur 3 ans.'
  },

  pfu: {
    title: 'Flat Tax / PFU (SASU 2018+)',
    description: 'Prélèvement Forfaitaire Unique (30%) sur les dividendes. Alternative au barème progressif de l\'IR pour les dividendes.',
    additionalInfo: 'PFU = 12.8% d\'IR + 17.2% de prélèvements sociaux = 30% total. Peut être avantageux selon votre TMI.'
  },

  zfu: {
    title: 'ZFU (2018+)',
    description: 'Zone Franche Urbaine. Exonération partielle ou totale d\'Impôt sur les Sociétés selon l\'implantation géographique.',
    additionalInfo: 'Nécessite que votre société soit implantée dans une zone éligible.'
  },

  caisseRetraite: {
    title: 'Caisse de retraite (EURL 2018+)',
    description: 'Choix entre CIPAV (professions libérales) et SSI (commerçants/artisans). Les taux de cotisation diffèrent selon la caisse.',
    additionalInfo: 'CIPAV: taux fixes. SSI: taux progressifs basés sur le PASS.'
  }
}
