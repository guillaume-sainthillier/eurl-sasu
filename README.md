# EURL-SASU Calculator

Calculateur de cotisations sociales et fiscales pour EURL et SASU (2017-2018).

Compare les revenus nets entre EURL et SASU en tenant compte de toutes les charges sociales et fiscales françaises.

## 🚀 Features

- **Calculs précis** pour les années fiscales 2017 et 2018
- **Comparaison EURL vs SASU** avec différences de cotisations
- **Détails complets** : IS, IR, cotisations sociales, dividendes
- **Options fiscales** : ACCRE, PFU (Flat Tax), ZFU
- **Caisse de retraite** : CIPAV ou SSI (EURL 2018+)
- **Sauvegardes** : enregistrez vos scénarios avec nom personnalisé
- **Export/Import** : partagez vos configurations au format JSON
- **Partage de lien** : générez une URL avec tous vos paramètres
- **Aide contextuelle** : icônes d'aide sur chaque champ avec documentation détaillée

## 📦 Tech Stack

- **Framework**: Vue.js 3 (Composition API)
- **Language**: TypeScript 5
- **Build Tool**: Vite 7
- **State Management**: Pinia
- **UI Framework**: Tailwind CSS 4
- **Testing**: Vitest + Vue Test Utils
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/guillaume-sainthillier/eurl-sasu.git
cd eurl-sasu

# Install dependencies
yarn install

# Start development server
yarn dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Development
yarn dev              # Start dev server with hot reload

# Building
yarn build            # Build for production (outputs to dist/)
yarn preview          # Preview production build locally

# Testing
yarn test:unit        # Run unit tests
yarn test:unit:watch  # Run tests in watch mode
yarn test:unit:coverage # Generate coverage report

# Code Quality
yarn lint             # Run ESLint and fix issues
yarn type-check       # Run TypeScript compiler check
```

## 📁 Project Structure

```
src/
├── main.ts                      # Application entry point
├── App.vue                      # Root component
├── components/
│   ├── calculator/              # Calculator form and controls
│   │   ├── CalculatorForm.vue   # Main form with all parameters
│   │   ├── InputSlider.vue      # Reusable slider component
│   │   ├── YearSelector.vue     # Year dropdown (2017/2018)
│   │   ├── SavedStates.vue      # Save/load configurations
│   │   └── ShareLink.vue        # URL sharing
│   ├── results/                 # Results display components
│   │   ├── ResultsSummary.vue   # Main results summary
│   │   ├── RemunerationDetails.vue
│   │   ├── DividendesDetails.vue
│   │   ├── ImpotSocieteDetails.vue
│   │   └── ImpotRevenuDetails.vue
│   └── common/                  # Shared components
│       ├── HelpModal.vue        # General help documentation
│       └── HelpIcon.vue         # Field-specific help icons
├── services/                    # Business logic (framework-agnostic)
│   ├── ExerciceCalculator.ts    # Main calculation orchestrator
│   ├── ImpotSociete.ts          # Corporate tax calculator
│   ├── ImpotRevenu.ts           # Income tax calculator
│   ├── CotisationsSociales.ts   # Social contributions (EURL)
│   ├── Tranche.ts               # Tax bracket utility
│   └── pension-funds/           # Pension fund implementations
│       ├── Cipav.ts
│       ├── SSI.ts
│       └── PensionFundBase.ts
├── config/
│   ├── years.ts                 # Year configurations array
│   ├── helpContent.ts           # Field-specific help documentation
│   └── years/
│       ├── year2017.ts          # 2017 tax constants
│       └── year2018.ts          # 2018 tax constants
├── stores/                      # Pinia state management
│   ├── calculator.ts            # Main calculator state
│   └── savedStates.ts           # Saved configurations
├── composables/
│   ├── useCalculation.ts        # Calculation composable
│   └── useUrlState.ts           # URL state synchronization
├── types/
│   ├── calculator.types.ts      # Type definitions
│   └── year-config.types.ts     # Year configuration types
└── utils/
    └── formatters.ts            # Formatting utilities
```

## 🔧 Configuration

### Year Configuration System

Each year has a configuration object in `src/config/years/`:

```typescript
interface YearConfig {
  year: number
  pass: number  // PASS (Plafond Annuel de la Sécurité Sociale)
  taxBrackets: {
    ir: TaxBracket[]  // Income tax brackets
    is: TaxBracket[]  // Corporate tax brackets
  }
  rates: {
    tauxCsgCrds: number
    tauxCsgDeductible: number
    tauxAbattementDividendes: number
    // ... all year-specific rates
  }
  features: {
    hasPensionFundSelection: boolean  // CIPAV/SSI (2018+)
    hasFlatTax: boolean               // PFU (2018+)
    hasZfuExemption: boolean          // ZFU (2018+)
  }
}
```

### Adding a New Year

1. Create a new configuration file in `src/config/years/yearXXXX.ts`
2. Define all tax brackets, rates, and features for that year
3. Add the configuration to `src/config/years.ts`
4. The UI will automatically show the new year in the dropdown

## 🧪 Testing

The project has comprehensive test coverage:

- **Unit tests**: All calculation services and stores
- **Component tests**: Key UI components
- **Validation tests**: Cross-verification with original 2017/2018 apps

Run tests with:

```bash
yarn test:unit           # Run all tests
yarn test:unit:coverage  # Generate coverage report
```

Coverage is available in `coverage/index.html` after running coverage tests.

## 🚢 Deployment

The application is automatically deployed to GitHub Pages via GitHub Actions on every push to the `master` branch.

### Manual Deployment

```bash
# Build the production bundle
yarn build

# The dist/ folder can be deployed to any static hosting service
```

### GitHub Actions Workflow

The CI/CD pipeline:
1. **Install**: Install dependencies with Yarn caching
2. **Test**: Run tests, lint, and type-check in parallel
3. **Build**: Build production bundle (only on master)
4. **Deploy**: Deploy to GitHub Pages (only on master)

## 📖 How It Works

### Calculation Flow

1. User inputs parameters (CA, charges, rémunération, etc.)
2. Calculator store triggers reactive calculation
3. `ExerciceCalculator` orchestrates all calculations:
   - Calculates IS (Impôt sur les Sociétés)
   - Calculates social contributions (EURL or SASU)
   - Calculates IR (Impôt sur le Revenu)
   - Computes net income
4. Results are displayed with detailed breakdowns

### Key Differences: EURL vs SASU

**EURL (Entreprise Unipersonnelle à Responsabilité Limitée)**:
- Gérant majoritaire = Travailleur Non Salarié (TNS)
- Cotisations sociales ~45% du net sur la rémunération
- Dividendes: cotisations sociales élevées (45%) sur la part > 10% du capital
- Caisse de retraite: CIPAV ou SSI (2018+)

**SASU (Société par Actions Simplifiée Unipersonnelle)**:
- Président = Assimilé Salarié
- Cotisations sociales ~82% du net sur la rémunération (~35% avec ACCRE)
- Dividendes: 17.2% de prélèvements sociaux uniquement
- Option PFU (Flat Tax 30%) possible en 2018+

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. All tests pass: `yarn test:unit`
2. Code is linted: `yarn lint`
3. Types are valid: `yarn type-check`
4. Build succeeds: `yarn build`

## 📝 License

MIT License - see LICENSE file for details

## 👤 Author

Guillaume Sainthillier (guillaume.sainthillier@gmail.com)

## 🔗 Links

- **Live Demo**: https://guillaume-sainthillier.github.io/eurl-sasu/
- **Repository**: https://github.com/guillaume-sainthillier/eurl-sasu

---

**Note**: This calculator is based on French tax laws for 2017 and 2018. Tax laws change regularly - always verify calculations with a certified accountant.
