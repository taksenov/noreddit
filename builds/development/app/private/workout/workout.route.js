/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngGirlsFit.workout')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {
        $stateProvider
            .state('workout', {
                url: '/workout',
                templateUrl: 'app/private/workout/workout.html',
                controller: 'WorkoutCtrl',
                controllerAs: 'vm'

                ,
                resolve: {
                    'currentAuth' : function ( AuthfireFactory, $rootScope ) {
                        $rootScope.publicPart = false;
                        return AuthfireFactory.ngAuth().$requireAuth();
                    }
                }

            });
    }

})();
