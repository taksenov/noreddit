/**
 * Created by admin on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngGirlsFit.workout')
        .controller('WorkoutCtrl', workoutCtrl);

    workoutCtrl.$inject = [ '$scope', '$rootScope',
                            'AuthfireFactory' ];

    function workoutCtrl( $scope, $rootScope,
                          AuthfireFactory ) {

        var vm = this;

        // всплывающая подсказка над ачивками, больше не удаляй!
        angular.element('.gf-left-navigation__list [data-toggle="tooltip"]').tooltip();

        $rootScope.curPath = 'workout';
        $rootScope.publicPart = false;
        $rootScope.publicPartWorkout = true;

        vm.logout = function (  ) {
            console.log( 'Пользователь должен выйти из системы.' );
            AuthfireFactory.logout();
        }; // ~~~ vm.logout ~~~

    } // ~~~ workoutCtrl ~~~

})();


