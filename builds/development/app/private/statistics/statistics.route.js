/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngGirlsFit.statistics')
        .config(route);

    route.$inject = ['$stateProvider', '$urlRouterProvider'];

    function route($stateProvider, $urlRouterProvider) {

        $urlRouterProvider
            .when('/statistics', '/statistics/detail')        //редирект в статистика --> детально
        ; // ~~~ $urlRouterProvider ~~~

        $stateProvider
            .state('statistics', {
                url: '/statistics',
                templateUrl: 'app/private/statistics/statistics.html',
                controller: 'StatisticsCtrl',
                controllerAs: 'vm'

                ,
                resolve: {
                    'currentAuth' : function ( AuthfireFactory, $rootScope ) {
                        $rootScope.publicPart = false;
                        return AuthfireFactory.ngAuth().$requireAuth();
                    }
                }


            }) // statistics
            // nested states
            .state('statistics.common', {
                url: '/common',
                templateUrl: 'app/private/statistics/statistics.common.html',
                controller: 'StatisticsCommonCtrl',
                controllerAs: 'vm'

                ,
                resolve: {
                    'currentAuth' : function ( AuthfireFactory, $rootScope ) {
                        $rootScope.publicPart = false;
                        return AuthfireFactory.ngAuth().$requireAuth();
                    }
                }


            }) // статистика общая
            .state('statistics.detail', {
                url: '/detail',
                templateUrl: 'app/private/statistics/statistics.detail.html',
                controller: 'StatisticsDetailCtrl',
                controllerAs: 'vm'

                ,
                resolve: {
                    'currentAuth' : function ( AuthfireFactory, $rootScope ) {
                        $rootScope.publicPart = false;
                        return AuthfireFactory.ngAuth().$requireAuth();
                    }
                }


            }) // статистика детальная
        ; // ~~~ $stateProvider ~~~
    }

})();






