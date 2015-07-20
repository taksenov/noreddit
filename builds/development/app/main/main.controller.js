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

        var ref = new Firebase( FIREBASE_URL );
        var allCommentsRef = ref.child( 'comments' );

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

        //function getComments() {
        //
        //    var def2 = $q.defer();
        //    allCommentsRef.once('value', function (_commentsSnap) {
        //        var comments = {};
        //
        //        _commentsSnap.forEach(
        //            function(childSnap) {
        //                comments[ childSnap.key() ] = ( childSnap.val() );
        //            } // function(childSnap)
        //        );
        //        def2.resolve(comments);
        //
        //    });
        //
        //    return def2.promise;
        //
        //} // function getComments()
        //
        //function getPosts() {
        //    var def = $q.defer();
        //    ref.child('posts').once('value', function( snap ) {
        //        var records = {};
        //
        //        snap.forEach(
        //            function(childSnap) {
        //                records[ childSnap.key() ] = ( childSnap.val() );
        //            } // function(childSnap)
        //        );
        //        def.resolve(records);
        //    });
        //    return def.promise;
        //} //function getPosts()


        $q.all( [
            ngfitfire.getPosts(),
            ngfitfire.getComments() ] )
        .then(
            function (results) {
                var posts = [];
                var allPosts = {};

                for ( var ind in results[0] ) {
                    allPosts[ind-1] = {
                        'comments': results[1][ind]
                    };
                    posts[ind-1] = extend({}, results[0][ind], allPosts[ind-1] );
                }

                vm.allPosts = posts;
                $log.debug( 'vm.allPosts =', vm.allPosts );
            }
        ); // $q.all

    } // ~~~ allPostsMainPageCtrl ~~~

    function formPostAddCtrl( $scope, $rootScope,
                           ngfitfire, $modal,
                           AuthfireFactory, FIREBASE_URL,
                           $log ) {
        var vm = this;

        vm.addNewPost = true;

        //$rootScope.curPath = 'main';
        //$rootScope.publicPart = true;
        //$rootScope.publicPartWorkout = false;

        //$scope.addNewPost = true;
        vm.addNewPostFunc = function () {
            $log.debug('Открыта форма добавления нового поста');
            vm.addNewPost = false;
        };

        vm.cancelPostFunc = function () {
            $log.debug('Закрыта форма добавления нового поста');
            vm.addNewPost = true;
        };

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


