/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngGirlsFit.exercises')
        .controller('ExercisesCtrl', exercisesCtrl)
        .controller('ExercisesBlocksCtrl', exercisesBlocksCtrl)
        .controller('ExercisesStringsCtrl', exercisesStringsCtrl)
        .controller('ModalInstanceCtrl', modalInstanceCtrl)
    ;

    exercisesCtrl.$inject = [ '$scope', '$rootScope',
                              'ngfitfire', '$modal',
                              'AuthfireFactory' ];
    exercisesBlocksCtrl.$inject = [ '$scope', '$rootScope',
                                    'ngfitfire', '$modal',
                                    '$log' ];
    exercisesStringsCtrl.$inject = [ '$scope', '$rootScope',
                                     'ngfitfire', '$modal',
                                     '$log' ];
    modalInstanceCtrl.$inject = [
                                '$scope', '$modal', '$log', '$rootScope',
                                'ngfitfire', '$modalInstance',
                                'modalCaption', 'exercise',
                                'isEdit'
                            ];

    function modalInstanceCtrl(
                                $scope, $modal, $log, $rootScope, ngfitfire, $modalInstance,
                                modalCaption, exercise,
                                isEdit
                            ) {

        var vm = this;

        $scope.modalCaption = modalCaption;
        $scope.exercise = exercise;
        vm.isEdit = isEdit;
        $scope.isEditExercise = isEdit;
        vm.isFormValid = false;
        $scope.formIsNotValid = false;
        $scope.addNewExercise = false;

        vm.exerciseEdit = function ( _id, _exersiceObj ) {
            ngfitfire.exerciseEdit( _id, _exersiceObj );
        }; // ~~~ vm.exerciseEdit ~~~

        vm.exerciseAdd = function () {
            //$scope.exercise.isWorkout = false;
            //$scope.exercise.isWorkout = false;
            ngfitfire
                .exerciseAdd( $scope.exercise,
                    function () {
                        $scope.exercise = null;
                    }
                );
        }; // ~~~ vm.exerciseAdd ~~~

        $scope.ok = function () {

            vm.isFormValid = $scope.exerciseForm.$valid;

            if ( vm.isFormValid ) {

                if ( vm.isEdit ) {
                    $log.debug('Редактируем упражнение');

                    vm.exersiceObj = {
                        //id: $scope.exercise.$id,
                        description: $scope.exercise.description,
                        exerciseCount: $scope.exercise.exerciseCount,
                        name: $scope.exercise.name,
                        img: $scope.exercise.img,
                        video: $scope.exercise.video,
                        ownerid: $rootScope.currentUser.id,
                        repeatCount: $scope.exercise.repeatCount,
                        time: $scope.exercise.time
                    };

                    for (var i in vm.exersiceObj) {
                        if ( typeof( vm.exersiceObj[i] ) === 'undefined'  ) {
                            vm.exersiceObj[i] = '';
                        }
                    }

                    vm.exerciseEdit( $scope.exercise.$id, vm.exersiceObj );

                    $scope.exercise = null;
                    vm.exersiceObj = {};
                    $modalInstance.close();

                } else {
                    $log.debug('Добавляем новое упражнение');
                    vm.exerciseAdd();
                    $scope.exercise = null;
                    $scope.formIsNotValid = false;
                    $scope.addNewExercise = true;
                }

            } else {
                $scope.formIsNotValid = true;
                $scope.addNewExercise = false;
            }

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    } // ~~~ modalInstanceCtrl ~~~

    function exercisesCtrl( $scope, $rootScope,
                            ngfitfire, $modal,
                            AuthfireFactory ) {

        var vm = this;

        $scope.animationsEnabled = true;

        // всплывающая подсказка над ачивками, больше не удаляй!
        angular.element('.gf-left-navigation__list [data-toggle="tooltip"]').tooltip();

        $rootScope.curPath = 'exercises';
        $rootScope.publicPart = false;
        $rootScope.publicPartWorkout = false;

        vm.logout = function (  ) {
            console.log( 'Пользователь должен выйти из системы.' );
            AuthfireFactory.logout();
        }; // ~~~ vm.logout ~~~

        //var exerciseFilterNameClean;
        vm.exerciseFilterNameClean = function () {
            console.log( 'Нужно почистить инпут!' );
            console.log( $rootScope.exerciseFilter );
        };



    } // ~~~ exercisesCtrl ~~~

    function exercisesBlocksCtrl($scope, $rootScope,
                                 ngfitfire, $modal,
                                 $log ) {

        var vm = this;
        $scope.animationsEnabled = true;

        vm.exerciseBlockChange = function ( _exercise ) {

            $log.debug( 'Упражнение: ', _exercise );

            vm.exersiceObj = {
                img: _exercise.img,                                //чтобы картинка не поменялась на дефолтную, она не должна уходить как undefined
                isWorkout: _exercise.isWorkout
            };

            for (var i in vm.exersiceObj) {
                if ( typeof( vm.exersiceObj[i] ) === 'undefined'  ) {
                    vm.exersiceObj[i] = '';
                }
            }

            ngfitfire.exerciseEdit( _exercise.$id, vm.exersiceObj );

            $scope.exercise = null;
            vm.exersiceObj = {};

        };

        ngfitfire.getUserExercises( function ( _data ) {
            vm.userExercises = _data;
        } ); // ~~~ getUserExercises ~~~

        vm.editUserExercise = function ( _exercise ) {
            $scope.exercise = _exercise;
            $scope.modalCaption = 'Редактировать упражнение';
            vm.isEdit = true;
            $modal.open(
                        {
                            animation: $scope.animationsEnabled,
                            templateUrl: '/app/private/exercises/exercises.modal.html',
                            controller: 'ModalInstanceCtrl',
                            resolve: {
                                modalCaption: function () {
                                    return $scope.modalCaption;
                                },
                                exercise: function () {
                                    return $scope.exercise;
                                },
                                isEdit: function () {
                                    return vm.isEdit;
                                }
                            }
                        }
            ); // ~~~ $modal.open ~~~
        }; // ~~~ editUserExercise ~~~

        vm.openModalForAddExercise = function ( e ) {
            e.preventDefault();
            $scope.exercise = null;
            $scope.modalCaption = 'Добавить упражнение';
            vm.isEdit = false;
            $modal.open(
                        {
                            animation: $scope.animationsEnabled,
                            templateUrl: '/app/private/exercises/exercises.modal.html',
                            controller: 'ModalInstanceCtrl',
                            resolve: {
                                modalCaption: function () {
                                    return $scope.modalCaption;
                                },
                                exercise: function () {
                                    return $scope.exercise;
                                },
                                isEdit: function () {
                                    return vm.isEdit;
                                }
                            }
                        }
            ); // ~~~ $modal.open ~~~
        }; // ~~~ openModalForAddExercise ~~~

        vm.exerciseDelete = function ( _exercise ) {
            ngfitfire.exerciseDelete( _exercise );
        }; // ~~~ vm.exerciseDelete ~~~


    } // ~~~ exercisesBlocksCtrl ~~~

    function exercisesStringsCtrl( $scope, $rootScope,
                                   ngfitfire, $modal, $log ) {

        var vm = this;
        $scope.animationsEnabled = true;

        vm.exerciseBlockChange = function ( _exercise ) {

            $log.debug( 'Упражнение: ', _exercise );

            vm.exersiceObj = {
                img: _exercise.img,                                //чтобы картинка не поменялась на дефолтную, она не должна уходить как undefined
                isWorkout: _exercise.isWorkout
            };

            for (var i in vm.exersiceObj) {
                if ( typeof( vm.exersiceObj[i] ) === 'undefined'  ) {
                    vm.exersiceObj[i] = '';
                }
            }

            ngfitfire.exerciseEdit( _exercise.$id, vm.exersiceObj );

            $scope.exercise = null;
            vm.exersiceObj = {};

        };

        ngfitfire.getUserExercises( function (_data) {
            vm.userExercises = _data;
        } ); // ~~~ getUserExercises ~~~

        vm.editUserExercise = function (_exercise) {
            $scope.exercise = _exercise;
            $scope.modalCaption = 'Редактировать упражнение';
            vm.isEdit = true;
            $modal.open(
                        {
                            animation: $scope.animationsEnabled,
                            templateUrl: '/app/private/exercises/exercises.modal.html',
                            controller: 'ModalInstanceCtrl',
                            resolve: {
                                modalCaption: function () {
                                    return $scope.modalCaption;
                                },
                                exercise: function () {
                                    return $scope.exercise;
                                },
                                isEdit: function () {
                                    return vm.isEdit;
                                }
                            }
                        }
            ); // ~~~ $modal.open ~~~
        }; // ~~~ editUserExercise ~~~

        vm.openModalForAddExercise = function (e) {
            e.preventDefault();
            $scope.exercise = null;
            $scope.modalCaption = 'Добавить упражнение';
            vm.isEdit = false;
            $modal.open(
                        {
                            animation: $scope.animationsEnabled,
                            templateUrl: '/app/private/exercises/exercises.modal.html',
                            controller: 'ModalInstanceCtrl',
                            resolve: {
                                modalCaption: function () {
                                    return $scope.modalCaption;
                                },
                                exercise: function () {
                                    return $scope.exercise;
                                },
                                isEdit: function () {
                                    return vm.isEdit;
                                }
                            }
                        }
            ); // ~~~ $modal.open ~~~
        }; // ~~~ openModalForAddExercise ~~~

        vm.exerciseDelete = function ( _exercise ) {
            ngfitfire.exerciseDelete( _exercise );
        }; // ~~~ vm.exerciseDelete ~~~

    } // ~~~ exercisesStringsCtrl ~~~

})();
