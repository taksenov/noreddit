/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngGirlsFit.statistics')
        .controller('StatisticsCtrl', statisticsCtrl)
        .controller('StatisticsCommonCtrl', statisticsCommonCtrl)
        .controller('StatisticsDetailCtrl', statisticsDetailCtrl);

    statisticsCtrl.$inject = [ '$scope', '$rootScope',
                               'AuthfireFactory' ];
    statisticsCommonCtrl.$inject = ['$scope', '$rootScope'];
    statisticsDetailCtrl.$inject = ['$scope', '$rootScope'];

    function statisticsCtrl( $scope, $rootScope,
                             AuthfireFactory ) {

        var vm = this;

        // всплывающая подсказка над ачивками, больше не удаляй!
        angular.element('.gf-left-navigation__list [data-toggle="tooltip"]').tooltip();

        $rootScope.curPath = 'statistics';
        $rootScope.publicPart = false;
        $rootScope.publicPartWorkout = false;

        vm.logout = function (  ) {
            console.log( 'Пользователь должен выйти из системы.' );
            AuthfireFactory.logout();
        }; // ~~~ vm.logout ~~~

    } // ~~~ statisticsCtrl ~~~

    function statisticsCommonCtrl($scope, $rootScope) {

    } // ~~~ statisticsCommonCtrl ~~~

    function statisticsDetailCtrl($scope, $rootScope) {

    } // ~~~ statisticsDetailCtrl ~~~



})();
