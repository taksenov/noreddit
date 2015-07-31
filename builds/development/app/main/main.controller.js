/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.main')
        .controller('MainCtrl', mainCtrl)
        .controller('OpenModalSingInCtrl', openModalSingInCtrl)
        .controller('FormPostAddCtrl', formPostAddCtrl)
        .controller('AllPostsMainPageCtrl', allPostsMainPageCtrl)
    ;

    mainCtrl.$inject = [ '$scope', '$rootScope',
                         'ngfitfire', '$modal',
                         'AuthfireFactory' ];
    openModalSingInCtrl.$inject = [ '$scope', '$rootScope',
                                    'ngfitfire', '$modal',
                                    'AuthfireFactory', 'FIREBASE_URL' ];
    formPostAddCtrl.$inject = [ '$scope', '$rootScope',
                                    'ngfitfire', '$modal',
                                    'AuthfireFactory', 'FIREBASE_URL',
                                    '$log' ];
    allPostsMainPageCtrl.$inject = [ '$scope', '$rootScope',
                                    'ngfitfire', '$modal',
                                    'AuthfireFactory', 'FIREBASE_URL',
                                    '$log', '$firebaseObject', '$firebaseArray', '$q' ];

    // extend function: https://gist.github.com/katowulf/6598238
    function extend(base) {
        var parts = Array.prototype.slice.call(arguments, 1);
        parts.forEach(function (p) {
            if (p && typeof (p) === 'object') {
                for (var k in p) {
                    if (p.hasOwnProperty(k)) {
                        base[k] = p[k];
                    }
                }
            }
        });
        return base;
    } // ~~~ extend function: https://gist.github.com/katowulf/6598238 ~~~


    function allPostsMainPageCtrl( $scope, $rootScope,
                           ngfitfire, $modal,
                           AuthfireFactory, FIREBASE_URL,
                           $log, $firebaseObject, $firebaseArray, $q ) {

        var vm = this;

        //ngfitfire.getAllPosts( function (_data) {
        //    vm.allPosts = _data;
        //
        //    $log.debug( '42 --- vm.allPosts =', vm.allPosts );
        //
        //} ); // ~~~ getAllPosts ~~~

        $q.all( [
            ngfitfire.getPosts(),
            ngfitfire.getComments(),
            ngfitfire.getAvatars() ] )
        .then(
            function (results) {
                var posts = [];
                var allPosts = {};

                for ( var i in results[1] ) {
                    for ( var i1 in results[1][i]  ) {

                        // добаляем аватарку в объект
                        if (  results[2][ results[1][i][i1]['ownerId'] ] !== undefined  ) {
                            results[1][i][i1]['avatar'] = results[2][ results[1][i][i1]['ownerId'] ]['avatar'];
                        } // добаляем аватарку в объект

                        if ( results[1][i][i1] === 'status=true' ) {
                            delete results[1][i][i1];
                        }
                    }
                }

                for ( var ind in results[0] ) {

                    // добаляем аватарку в объект
                    if (  results[2][ results[0][ind]['ownerId'] ] !== undefined  ) {
                        results[0][ind]['avatar'] = results[2][ results[0][ind]['ownerId'] ]['avatar'];
                    } // добаляем аватарку в объект

                    allPosts[ind-1] = {
                        'comments': results[1][ind]
                    };
                    posts[ind-1] = extend({}, results[0][ind], allPosts[ind-1] );
                    posts[ind-1] = extend({}, posts[ind-1], { 'elementIndex': ind-1 } );
                }

                vm.allPosts = posts;
                $rootScope.allPosts = posts;
                $log.debug( 'vm.allPosts =', vm.allPosts );
                //$log.debug( 'results[0] =', results[0] );
                //$log.debug( '$rootScope.currentUser =', $rootScope.currentUser );

            }
        ); // $q.all

        vm.postEdit = function ( _element1, _element2 ) {
            $log.debug( 'Редактировать, выбранный пост имеет индекс =', _element1 );
            $log.debug( 'Редактировать, postID =', _element2 );
        }; // ~~~ vm.postEdit ~~~

        vm.postDelete = function (element) {
            $log.debug( 'удалить, выбранный пост имеет индекс =', element );
        }; // ~~~ vm.postDelete ~~~

        vm.addNewCommentFunc = function ( _post ) {
            $log.debug('Открыта форма добавления нового комментария');
            $scope.addNewCommentSelected = _post;
        }; // vm.addNewPostFunc ~~~ показать форму

        vm.cancelCommentFunc = function () {
            $log.debug('Закрыта форма добавления нового комментария');
            $scope.addNewCommentSelected = false;
        }; // vm.cancelPostFunc ~~~ скрыть форму

        // условие для того чтобы открывалась форма добавления комментария, только в конкретном посте
        vm.isSelectedFormAddNewComment = function ( _post ) {
            return $scope.addNewCommentSelected === _post;
        }; // ~~~ vm.isSelectedFormAddNewComment ~~~


        vm.addNewComment = function () {

        }; // ~~~ vm.addNewComment ~~~

    } // ~~~ allPostsMainPageCtrl ~~~

    function formPostAddCtrl( $scope, $rootScope,
                           ngfitfire, $modal,
                           AuthfireFactory, FIREBASE_URL,
                           $log ) {
        var vm = this;

        vm.addNewPost = true;

        vm.addNewPostFunc = function () {
            $log.debug('Открыта форма добавления нового поста');
            vm.addNewPost = false;
        }; // vm.addNewPostFunc ~~~ показать форму

        vm.cancelPostFunc = function () {
            $log.debug('Закрыта форма добавления нового поста');
            vm.addNewPost = true;
        }; // vm.cancelPostFunc ~~~ скрыть форму

        vm.submitNewPost = function () {
            vm.newpost = extend( {},
                                 vm.newpost,
                                 {
                                    'dateTime': Math.round(new Date().getTime() / 1000),   //10
                                    'ownerId': $rootScope.currentUser.id,
                                    'ownerName': $rootScope.currentUser.name
                                 }
            );

            $log.debug( '$rootScope.currentUser =', $rootScope.currentUser );
            $log.debug('Добавлен новый пост', vm.newpost);
            ngfitfire
                .newPostAdd(
                    vm.newpost,
                    function () {
                        vm.newpost = null;
                    }
            );
        }; // vm.submitNewPost ~~~ добавить новый пост

    } // ~~~ formPostAdd ~~~


    function mainCtrl( $scope, $rootScope,
                       ngfitfire, $modal,
                       AuthfireFactory ) {

        var vm = this;

        $rootScope.curPath = 'main';
        $rootScope.publicPart = true;
        $rootScope.publicPartWorkout = false;

        vm.animationsEnabled = true;

    } // ~~~ mainCtrl ~~~

    function openModalSingInCtrl( $scope, $rootScope,
                                  ngfitfire, $modal,
                                  AuthfireFactory, FIREBASE_URL ) {

        var vm = this;

        vm.animationsEnabled = true;

        vm.openModalSingIn = function ( e ) {
            e.preventDefault();
            vm.modalCaption = 'Вход в личный кабинет';
            $modal.open(
                {
                    animation: vm.animationsEnabled,
                    templateUrl: '/app/components/auth-modal/sign-in-modal.html',
                    controller: 'ModalSingInCtrl',
                    resolve: {
                        modalCaption: function () {
                            return vm.modalCaption;
                        }
                    }
                }
            ); // ~~~ $modal.open ~~~
        }; // ~~~ openModalSingIn ~~~

        vm.openModalSingUp = function ( e ) {
            e.preventDefault();
            vm.modalCaption = 'Регистрация';
            $modal.open(
                {
                    animation: vm.animationsEnabled,
                    templateUrl: '/app/components/auth-modal/sign-up-modal.html',
                    controller: 'ModalSingUpCtrl',
                    resolve: {
                        modalCaption: function () {
                            return vm.modalCaption;
                        }
                    }
                }
            ); // ~~~ $modal.open ~~~
        }; // ~~~ openModalSingUp ~~~


        vm.logout = function (  ) {
            AuthfireFactory.logout();
        }; // ~~~ vm.logout ~~~

    } // ~~~ openModalSingInCtrl ~~~

})();


