/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngGirlsFit.about')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {
        $stateProvider
            .state('about', {
                url: '/about',
                views : {
                    'navbarPublick' : {
                        templateUrl: 'app/components/navbar-public/navbar-public.html',
                        controller: 'OpenModalSingInCtrl',
                        controllerAs: 'vm'
                    },
                    'mainContent' : {
                        templateUrl: 'app/about/about.html',
                        controller: 'AboutCtrl',
                        controllerAs: 'vm'

                        //,
                        //resolve: {
                        //    'currentAuth' : function ( AuthfireFactory, $rootScope ) {
                        //        $rootScope.publicPart = true;
                        //        return AuthfireFactory.ngAuth().$requireAuth();
                        //    }
                        //}

                    }
                }




            });
    }

})();
