/**
 * Created by taksenov@gmail.com on 22.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngGirlsFit.about')
        .controller('AboutCtrl', aboutCtrl);

    aboutCtrl.$inject = ['$scope', '$rootScope'];

    function aboutCtrl($scope, $rootScope) {
        $rootScope.curPath = 'about';
        $rootScope.publicPart = true;
        $rootScope.publicPartWorkout = false;
    }

})();

