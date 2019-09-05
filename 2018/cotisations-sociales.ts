// https://www.urssaf.fr/portail/home/taux-et-baremes/taux-de-cotisations/les-professions-liberales/bases-de-calcul-et-taux-des-coti.html
export default class CotisationsSociales {

    remuneration: number = 0;
    accre: boolean;
    PASS: number = 39732;
    caisseRetraite;

    _revenuPro() {
        return this.remuneration;
    }

    _tauxProgressif(montantMin, tauxMin, montantMax, tauxMax, montant) {
        let pc = montant / montantMax;
        return tauxMin + ((tauxMax - tauxMin) * (montant - montantMin) / (montantMax - montantMin));
    }

    // MALADIE
    getMaladie(): number {
        let taux = this.getTauxMaladie();
        let assiette = this.getAssietteMaladie();

        return assiette * taux / 100;   
    }

    getAssietteMaladie(): number {
        return Math.max(40 * this.PASS / 100, this._revenuPro());
    }

    getTauxMaladie() {
        let assiette = this.getAssietteMaladie();

        // https://www.secu-independants.fr/cotisations/presentation-cotisations/liste-des-cotisations/?reg=agence-professions-liberales&pro=profession-liberale&act=actif&ae=non
        if (assiette > 110 * this.PASS / 100) {
            return 6.5;
        }

        // Taux progressif : entre 1,50 % et 6,50 %
        let tauxMin = 1.5;
        let tauxMax = 6.5;
        let montantMin = 40  * this.PASS / 100;
        let montantMax = 110 * this.PASS / 100;

        return this._tauxProgressif(montantMin, tauxMin, montantMax, tauxMax, assiette);
    }

    // MALADIE 2
    getMaladie2(): number {
        let taux = this.getTauxMaladie2();
        let assiette = this.getAssietteMaladie2();

        return assiette * taux / 100;   
    }

    getAssietteMaladie2(): number {
        let revenuMinimal = Math.max(40 * this.PASS / 100, this._revenuPro());
        
        return Math.min(5 * this.PASS, revenuMinimal);
    }

    getTauxMaladie2(): number {
        return 0.85;
    }
    
    // ALLOCATIONS FAMILIALES
    getAllocationsFamiliales(): number {
        let taux = this.getTauxAllocationsFamiliales();
        let assiette = this.getAssietteAllocationsFamiliales();

        return assiette * taux / 100;
    }

    getAssietteAllocationsFamiliales(): number {
        return this._revenuPro();
    }

    getTauxAllocationsFamiliales(): number {
        let assiette = this.getAssietteAllocationsFamiliales();
        if (assiette < 110 * this.PASS / 100) {
            return 0;
        }

        if(assiette > 140 * this.PASS / 100) {
            return 3.10;
        }

        //taux progressif : entre 0 % et 3,10 %
        let tauxMin = 0;
        let tauxMax = 3.10;
        let montantMin = 110 * this.PASS / 100;
        let montantMax = 140 * this.PASS / 100;

        return this._tauxProgressif(montantMin, tauxMin, montantMax, tauxMax, assiette);
    }

    // FORMATION PRO
    getFormationProfessionnelle(): number {
        let taux = this.getTauxFormationProfessionnelle();
        let assiette = this.getAssietteFormationProfessionnelle();

        return assiette * taux / 100;
    }

    getAssietteFormationProfessionnelle(): number {
        return this.PASS;
    }

    getTauxFormationProfessionnelle(): number {
        return 0.25;
    }

    // CSG CRDS
    getCsgCrds(): number {
        return this.getCsgCrdsDeductible() + this.getCsgCrdsNonDeductible();
    }

    getAssietteCsgCrds(): number {
        return this._revenuPro() +
            this.getMaladie() +
            this.getMaladie2() +
            this.caisseRetraite.getRetraiteBase() + 
            this.caisseRetraite.getRetraiteComplementaire() + 
            this.caisseRetraite.getInvaliditeDeces() + 
            this.getAllocationsFamiliales();
    }

    // CSG CRDS DEDUCTIBLE
    getCsgCrdsDeductible(): number {
        let taux = this.getTauxCsgCrdsDeductible();
        let assiette = this.getAssietteCsgCrdsDeductible();

        return assiette * taux / 100;
    }

    getAssietteCsgCrdsDeductible(): number {
        return this.getAssietteCsgCrds();
    }

    getTauxCsgCrdsDeductible(): number {
        return 2.9;
    }

    // CSG CRDS DEDUCTIBLE
    getCsgCrdsNonDeductible(): number {
        let taux = this.getTauxCsgCrdsNonDeductible();
        let assiette = this.getAssietteCsgCrdsNonDeductible();

        return assiette * taux / 100;
    }

    getAssietteCsgCrdsNonDeductible(): number {
        return this.getAssietteCsgCrds();
    }

    getTauxCsgCrdsNonDeductible(): number {
        return 6.8;
    }

    // COTISATIONS
    getCotisations(): number {
        return this.getMaladie()
            + this.getMaladie2()
            + this.getAllocationsFamiliales()
            + this.getFormationProfessionnelle()
            + this.caisseRetraite.getRetraiteBase()
            + this.caisseRetraite.getRetraiteComplementaire()
            + this.caisseRetraite.getInvaliditeDeces()
            + this.getCsgCrds();
    }
}

