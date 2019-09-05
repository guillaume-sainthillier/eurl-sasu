export default class SSI {
	PASS: number = 39732;
    revenus: number;

    constructor(revenus) {
        this.revenus = revenus;
    }
	
    // RETRAITE DE BASE
	getRetraiteBase(): number {
        // https://www.secu-independants.fr/cotisations/calcul-des-cotisations/taux-de-cotisations/?reg=midi-pyrenees&pro=commercant&act=actif&ae=non
        let assiette = this.getAssietteRetraiteBase();
        let montant = Math.min(this.PASS, assiette) * 17.75 / 100;

        if(assiette > this.PASS) {
            montant += (assiette - this.PASS) * 0.60 / 100;
        }

        return montant;
    }

    getAssietteRetraiteBase(): number {
        return Math.max(11.5 * this.PASS / 100, this.revenus);
    }

    getTauxRetraiteBase(): number {
        return this.getRetraiteBase() / this.getAssietteRetraiteBase() * 100;
    }

    // RETRAITE COMPLÉMENTAIRE
    getRetraiteComplementaire(): number {
    	// https://www.secu-independants.fr/cotisations/calcul-des-cotisations/taux-de-cotisations/?reg=midi-pyrenees&pro=commercant&act=actif&ae=non
        let montant = Math.min(37960, this.revenus) * 7 / 100;

        if(this.revenus > 37960) {
            montant += Math.min(4 * this.PASS, this.revenus - 37960) * 8 / 100;
        }

        return montant;
    }

    getAssietteRetraiteComplementaire(): number {
        return Math.max(11.5 * this.PASS / 100, this.revenus);
    }

    getTauxRetraiteComplementaire(): number {
        return this.getRetraiteComplementaire() / this.getAssietteRetraiteComplementaire() * 100;
    }

    // INVALIDITÉ DÉCÈS
    getInvaliditeDeces(): number {
    	// https://www.secu-independants.fr/cotisations/calcul-des-cotisations/taux-de-cotisations/?reg=midi-pyrenees&pro=commercant&act=actif&ae=non
        let assiette = this.getAssietteInvaliditeDeces();
        let taux = this.getTauxInvaliditeDeces();

        return assiette * taux / 100;
    }

    getAssietteInvaliditeDeces(): number {
        let revenuMinimal =  Math.max(11.5 * this.PASS / 100, this.revenus);
        return Math.min(this.PASS, revenuMinimal) 
    }

    getTauxInvaliditeDeces(): number {
        return 1.3;
    }
}