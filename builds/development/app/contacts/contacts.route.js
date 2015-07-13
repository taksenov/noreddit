/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngGirlsFit.contacts')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {
        $stateProvider
            .state('contacts', {
                url: '/contacts',
                views : {
                    'navbarPublick': {
                        templateUrl: 'app/components/navbar-public/navbar-public.html',
                        controller: 'OpenModalSingInCtrl',
                        controllerAs: 'vm'
                    },
                    'mainContent' : {
                        templateUrl: 'app/contacts/contacts.html',
                        controller: 'ContactsCtrl',
                        controllerAs: 'vm'
                    }
                }
            });
    }

})();

