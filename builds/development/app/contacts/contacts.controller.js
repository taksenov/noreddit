/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngGirlsFit.contacts')
        .controller('ContactsCtrl', contactsCtrl);

    contactsCtrl.$inject = ['$scope', '$rootScope'];

    function contactsCtrl($scope, $rootScope) {
        $rootScope.curPath = 'contacts';
        $rootScope.publicPart = true;
        $rootScope.publicPartWorkout = false;
    }

})();



