export default class Cipav {
	PASS: number = 39732;
    revenus: number;

    constructor(revenus) {
        this.revenus = revenus;
    }
	
    // RETRAITE DE BASE
	getRetraiteBase(): number {
        // https://www.lacipav.fr/sites/default/files/2018-08/GuideCipav2018_V19-BD-WEB-Pages_0.pdf p12
        if(this.getAssietteRetraiteBase() < 4569) {
            return 431;
        }

        return (
            (Math.min(1 * this.PASS, this.getAssietteRetraiteBase()) * 8.23) + 
            (Math.min(5 * this.PASS, this.getAssietteRetraiteBase()) * 1.87)
        ) / 100;
    }

    getAssietteRetraiteBase(): number {
        return this.revenus;
    }

    getTauxRetraiteBase(): number|null {
        if(this.revenus < 4569) {
            return null;
        }

        return this.getRetraiteBase() / this.getAssietteRetraiteBase() * 100;
    }

    // RETRAITE COMPLÉMENTAIRE
    getRetraiteComplementaire(): number {
        // https://www.lacipav.fr/sites/default/files/2018-08/GuideCipav2018_V19-BD-WEB-Pages_0.pdf p13
        if (this.revenus <= 26580) {
            return 1315;
        }
        if (this.revenus > 26580 && this.revenus <= 49280) {
            return 2630;
        }
        if (this.revenus > 49280 && this.revenus <= 57850) {
            return 3945;
        }
        if (this.revenus > 57850 && this.revenus <= 66400) {
            return 6575;
        }
        if (this.revenus > 66400 && this.revenus <= 83060) {
            return 9205;
        }
        if (this.revenus > 83060 && this.revenus <= 103180) {
            return 14465;
        }
        if (this.revenus > 103180 && this.revenus <= 123300) {
            return 15780;
        }
        if (this.revenus > 123300) {
            return 17095;
        }
    }

    getTauxRetraiteComplementaire(): number|null {
        return null;
    }

    // INVALIDITÉ DÉCÈS
    getInvaliditeDeces(classe = 'C'): number {
        switch(classe) {
            case 'A':
                return 76;
            case 'B':
                return 228;
            case 'C':
                return 380;
        }

        return 0;
    }

    getTauxInvaliditeDeces(): number|null {
        return null;
    }

    getAssietteInvaliditeDeces(): number|null {
        return null;
    }
}