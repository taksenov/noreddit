// author: taksenov@gmail.com

// initialize material design js
;$.material.init();

(function(){
    'use strict';

    $.material.init();

    // модуль и конфигурирование
    angular
        .module('ngGirlsFit', [
            'firebase',
            'ngGirlsFit.main',
            'ngGirlsFit.about',
            'ngGirlsFit.contacts',
            'ngGirlsFit.profile',
            'ngGirlsFit.workout',
            'ngGirlsFit.exercises',
            'ngGirlsFit.statistics',
            'ngGirlsFit.error404',
            'ngGirlsFit.charts',
            'ngGirlsFit.firebase.service',
            'ngGirlsFit.auth-modal',
            'authfire.factory',
            'ui.router',
            'chart.js',
            'ui.bootstrap',
            'angular-storage'
        ])
        .constant('FIREBASE_URL', 'https://nggirlsfit.firebaseio.com/')
        .config(ngGFConfig)
        .run(run);

    ngGFConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$logProvider'];

    function ngGFConfig($stateProvider, $urlRouterProvider, $locationProvider, $logProvider){
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });

        $logProvider.debugEnabled( true );

        $urlRouterProvider.otherwise(function ($injector, $location) {
            $injector.invoke(['$state', function ($state) { $state.go('error'); }]);
            return true;
        }); // ~~~ $urlRouterProvider ~~~
            // это сдернуто из интернета для страницы 404,
            // ~~~ https://www.snip2code.com/Snippet/151390/Show-Not-Found-(404)-page-without-changi
            // todo разобраться что такое invoke

        $urlRouterProvider
            .when('', '/')
        ; // ~~~ $urlRouterProvider ~~~

    } // ~~~ ngGFConfig ~~~

    run.$inject = ['$rootScope', '$state', 'store'];

    function run($rootScope, $state, store) {
        $rootScope.currentUser  = store.get('currentUser');
    } // ~~~ run ~~~


})();

