/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngGirlsFit.charts')
        .controller("LineCtrl", ['$scope', '$timeout', function ($scope, $timeout) {

            $scope.labels = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
            $scope.series = ['Бег', 'Бег с ускорением'];
            $scope.data = [
                [65, 59, 80, 81, 56, 55, 40],
                [28, 48, 40, 19, 86, 27, 90]
            ];
            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };

            // Simulate async data update
            $timeout(function () {
            $scope.data = [
                [28, 48, 40, 19, 86, 27, 90],
                [65, 59, 80, 81, 56, 55, 40]
            ];
            }, 3000);
        }]) // ~~~ LineCtrl ~~~
        .controller("BarCtrl", ['$scope', function ($scope) {
            $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
            $scope.series = ['Series A', 'Series B'];

            $scope.data = [
                [65, 59, 80, 81, 56, 55, 40],
                [28, 48, 40, 19, 86, 27, 90]
            ];
        }]) // ~~~ BarCtrl ~~~
    ;

            // todo разобраться с тем,
            // todo как можно будет динамически создавать графики

})();


