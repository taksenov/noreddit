/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngGirlsFit.main')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                views : {
                    'navbarPublick' : {
                        templateUrl: 'app/components/navbar-public/navbar-public.html',
                        controller: 'OpenModalSingInCtrl',
                        controllerAs: 'vm'
                    },
                    'mainContent' : {
                        templateUrl: 'app/main/main.html',
                        controller: 'MainCtrl',
                        controllerAs: 'vm'
                    }
                }

            }) // main
        ;
    }

})();
