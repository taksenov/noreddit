/**
 * Created by taksenov@gmail.com on 07.07.2015.
 */

;(function(){
    'use strict';

    angular
        .module('ngGirlsFit.exercises')
        .filter('exercisesFilter', exercisesFilter);

    exercisesFilter.$inject = ['$log', '$rootScope' ];

    function exercisesFilter( $log, $rootScope ){



    }

})();