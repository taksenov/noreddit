/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngGirlsFit.charts', [
            'chart.js',
            'ui.bootstrap'
        ])
        .config(['ChartJsProvider', function (ChartJsProvider) {
            // Configure all charts
            ChartJsProvider.setOptions({
                colours: ['#199F93', '#FF8A80'],
                responsive: true //адаптивный или нет график
            });
            // Configure all line charts
            ChartJsProvider.setOptions('Line', {
                datasetFill: true //закрашивать или нет область под лингией графика
            })
        }]) // ~~~ ChartJsProvider ~~~
    ;

})();

