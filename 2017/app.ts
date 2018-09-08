import 'angular';
import 'angular-i18n/fr';
import 'angular-ui-bootstrap';
import 'angular-cookies';
import 'ngclipboard/dist/ngclipboard';
import Exercice from './exercice';
import { doc } from './doc';
import 'angular-sanitize';
import ImpotSociete from "./impot-societe";
import CotisationsSociales from "./cotisations-sociales";
import ImpotRevenu from "./impot-revenu";

declare const angular: any;
declare const showdown: any;

class AppCtrl {

    public params: any;
    public nbMois: number;
    public resteJoursParMois: number;
    public resteSemainesParMois: number;
    public resteJoursParSemaine: number;
    public result;
    public newStateName: string;
    public url;
    public formes = ['EURL', 'SASU'];

    public states: Array<{ name: string, params: any }> = [];
    public currentState: any;

    constructor(
        private $uibModal,
        private $sce,
        private exercice: Exercice,
        private $cookies,
        private $location,
        private $filter) {
        this.params = {
            capital: { name: 'capital', min: 0, max: 100000, step: 100, value: 0 },
            charges: { name: 'charges', min: 0, max: 100000, step: 500, value: 0 },
            ca: { name: 'ca', min: 0, max: 200000, step: 500, value: 0 },
            nbMois: { name: 'nbMois', min: 0.25, max: 12, step: 0.25, value: 0.25 },
            remuneration: { name: 'remuneration', min: 0, max: 150000, step: 500, value: 0 },
            dividendes: { name: 'dividendes', min: 0, max: 150000, step: 500, value: 0 },
            autresRevenus: { name: 'autresRevenus', min: 0, max: 50000, step: 500, value: 0 },
            bnc: { name: 'bnc', min: 0, max: 50000, step: 500, value: 0 },
            nbParts: { name: 'nbParts', min: 1, max: 10, step: 0.5, value: 1 },
            accre: { name: 'ACCRE', notSlider: true, value: false },
            pfu: { name: 'PFU', notSlider: true, value: false },
            zfu: { name: 'ZFU', notSlider: true, value: false },
            forme: { name: 'Forme', notSlider: true, value: 'EURL' }
        };

        let cookieString = $cookies.get('states');
        this.states = cookieString ? JSON.parse(cookieString) : new Array<any>();
        if (this.states.length > 0) {
            this.currentState = this.states[0];
            this.loadState();
        }

        Object.keys(this.params).forEach(
            attr => this.params[attr].value =
                (typeof this.params[attr].value === 'number'
                    ? parseInt(this.$location.search()[attr])
                    : this.$location.search()[attr] === 'true')
                || this.params[attr].value);

        this.params.forme.value = this.$location.search()['forme'] || this.params.forme.value

        this.onChange();
    }

    pushState(event) {
        let filteredStates = this.$filter('filter')(this.states, { name: this.newStateName });

        let state = {
            name: this.newStateName,
            params: JSON.parse(JSON.stringify(this.params))
        };

        //Add new a new save
        if (filteredStates.length === 0) {
            this.states.push(state);
        } else {
            //Merge with existing save
            state = angular.extend(filteredStates[0], { params: this.params });
        }

        this.$cookies.put('states', JSON.stringify(this.states));
        this.currentState = state;

        event.preventDefault();
        return false;
    }

    loadState() {
        if (this.currentState === null) {
            this.newStateName = "";
            return;
        }

        this.params = angular.extend(this.params, this.currentState.params);
        this.newStateName = this.currentState.name;
        this.onChange();
    }

    clearState() {
        if (!this.currentState) {
            return;
        }

        var index = this.states.indexOf(this.currentState);

        if (-1 === index) {
            return;
        }

        this.states.splice(index, 1);
        this.$cookies.put('states', JSON.stringify(this.states));
        this.newStateName = "";
    }

    clearStates() {
        if (!confirm('Êtes-vous certain de vouloir supprimer toutes vos sauvegardes ?')) {
            return;
        }
        this.states = new Array<any>();
        this.$cookies.put('states', JSON.stringify(this.states));
        this.newStateName = "";
    }

    onChange(param = undefined) {
        if(this.params.forme.value !== 'SASU') {
            this.params.pfu.value = false;
        }

        this.exercice.capital = this.params.capital.value;
        this.exercice.ca = this.params.ca.value;
        this.exercice.charges = this.params.charges.value;
        this.exercice.remuneration = this.params.remuneration.value;
        this.exercice.dividendes = this.params.dividendes.value;
        this.exercice.accre2017 = this.params.accre.value;// === 'true';
        this.exercice.pfu = this.params.pfu.value;// === 'true';
        this.exercice.zfu = this.params.zfu.value;// === 'true';
        this.exercice.autresRevenus = this.params.autresRevenus.value;
        this.exercice.bnc = this.params.bnc.value;
        this.exercice.nbParts = this.params.nbParts.value;
        this.exercice.forme = this.params.forme.value;
        this.result = this.exercice.exercice();

        this.url = window.location.protocol +
            '//' +
            window.location.host +
            window.location.pathname +
            '?' + Object.keys(this.params).map(k => k + '=' + this.params[k].value).join('&')
    }
}

angular.module('app', ['ngLocale', 'ui.bootstrap', 'ngSanitize', 'ngCookies', 'ngclipboard'])
    .service('cotisationsSociales', [() => new CotisationsSociales()])
    .service('impotSociete', [() => new ImpotSociete()])
    .service('impotRevenu', [() => new ImpotRevenu()])
    .service('exercice', [
        'impotSociete', 'cotisationsSociales', 'impotRevenu',
        (impotSociete, cotisationsSociales, impotRevenu) => new Exercice(impotSociete, cotisationsSociales, impotRevenu)
    ])
    .controller('appCtrl', [
        '$uibModal', '$sce', 'exercice', '$cookies', '$location', '$filter',
        ($uibModal, $sce, exercice, $cookies, $location, $filter) => new AppCtrl($uibModal, $sce, exercice, $cookies, $location, $filter)
    ])
    .component('field', {
        bindings: {
            label: '@',
            doc: '@'
        },
        template: `
        <div class="value">
            <b>{{$ctrl.label}}<sup ng-if="$ctrl.doc" ng-click="$ctrl.openDoc($ctrl.doc)">?</sup></b> : <span ng-transclude></span>
        </div>`,
        transclude: true,
        controller: ['$uibModal', '$sce', function ($uibModal, $sce) {
            this.openDoc = function (id) {
                $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    size: 'lg',
                    controller: ['$scope', ($scope) => {
                        let converter = new showdown.Converter();
                        $scope.title = doc[id].title;
                        $scope.content = $sce.trustAsHtml(converter.makeHtml(doc[id].content));
                    }]
                });
            }
        }]
    })
    .directive('stringToNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    //debugger;
                    return parseInt(value);
                });
                ngModel.$formatters.push(function (value) {
                    //debugger;
                    return parseFloat(value);
                });
            }
        };
    });
