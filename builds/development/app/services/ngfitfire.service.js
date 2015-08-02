/**
 * Created by taksenov@gmail.com on 25.06.2015.
 */

;(function(){
    'use strict';

    angular
        .module('ngNoReddit.firebase.service', ['firebase'])
        .service('ngfitfire', ngfitfire);

    ngfitfire.$inject = [ 'FIREBASE_URL', '$firebaseObject',
                          '$firebaseArray', '$log',
                          '$rootScope', '$q' ];

    function ngfitfire( FIREBASE_URL, $firebaseObject,
                        $firebaseArray, $log,
                        $rootScope, $q ){

        var self = this;

        var ref = new Firebase( FIREBASE_URL );
        var usersRef = ref.child('users');
        var allPostsRef = ref.child( 'posts' );
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

        // получение списка всех постов
        self.getAllPosts = function(call_back){
            var allPostsArr = $firebaseArray( allPostsRef );

            return allPostsArr.$loaded( call_back );
        };
        // ~~~ self.getUserExercises ~~~

        // выборка всех постов для главной страницы
        self.getPosts = function () {
            var def = $q.defer();
            ref.child('posts').once('value', function( snap ) {
                var records = {};
                var i = 1; //внимание!

                snap.forEach(
                    function(childSnap) {
                        records[ i++ ] = extend({}, childSnap.val(), { 'postID': childSnap.key() } );
                    } // function(childSnap)
                );
                def.resolve(records);
            });
            return def.promise;
        };
        // ~~~ self.getPosts

        // выборка всех комментариев для главной страницы
        self.getComments = function () {
            var def2 = $q.defer();
            allCommentsRef.once('value', function (_commentsSnap) {
                var comments = {};
                var i = 1; //внимание!

                _commentsSnap.forEach(
                    function(childSnap) {
                        //comments[ childSnap.key() ] = ( childSnap.val() );
                        comments[ i++ ] = ( childSnap.val() );
                        //comments[ i++ ] = extend({}, childSnap.val(), { 'commentID': childSnap.key() } );
                    } // function(childSnap)
                );
                def2.resolve(comments);

            });

            return def2.promise;
        };
        // ~~~ self.getComments

        // выборка всех аватар для главной страницы
        self.getAvatars = function () {
            var def = $q.defer();
            ref.child('avatars').once('value', function( snap ) {
                var records = {};

                snap.forEach(
                    function(childSnap) {
                        records[ childSnap.key() ] = ( childSnap.val() );
                    } // function(childSnap)
                );
                def.resolve(records);
            });
            return def.promise;
        };
        // ~~~ self.getAvatars

        // добавление нового поста
        self.newPostAdd = function ( _newPostData ) {
            var newPostRef = allPostsRef.push( _newPostData );
            var postID = newPostRef.key();
            var onComplete = function(error) {
                if (error) {
                    $log.debug('addNewPost: Synchronization failed');
                } else {
                    $log.debug('addNewPost: Synchronization succeeded');
                }
            };

            allCommentsRef.child( postID ).set( { status: 'status=true' }, onComplete );
        };
        // ~~~ self.newPostAdd ~~~

        // добавление нового комментария
        self.newCommentAdd = function ( _newCommentData, _postID ) {
            //var newPostRef = allPostsRef.push( _newPostData );
            //var postID = newPostRef.key();
            var onComplete = function(error) {
                if (error) {
                    $log.debug('addNewComment: Synchronization failed');
                } else {
                    $log.debug('addNewComment: Synchronization succeeded');
                }
            };

            allCommentsRef.child( _postID ).push( _newCommentData, onComplete );

            $log.debug(
                'добавляемы данные',
                _newCommentData,
                'в пост =',
                _postID
            );

        };
        // ~~~ self.newCommentAdd ~~~

        // редактирование упражнения
        self.exerciseEdit = function ( _exerciseId, _exercise ) {
            var onComplete = function(error) {
                if (error) {
                    $log.debug('exerciseEdit Synchronization failed');
                } else {
                    $log.debug('exerciseEdit Synchronization succeeded');
                }
            };

            // проверка картинки, если из вне прийдет undefined или '' то меняется на дефолтную картинку
            if ( typeof( _exercise.img ) === 'undefined' ||
                 _exercise.img  === '' ) {
                _exercise.img = '../img/ngNoReddit-exercises-001.jpg'
            }

            exercisesRef.child( _exerciseId ).update( _exercise, onComplete );
        };
        // ~~~ self.exerciseEdit ~~~

        // удаление упражнения
        self.exerciseDelete = function ( _exercise ) {
            var urlOfExercise = exercisesRef + '/' + _exercise.$id,
                ref = new Firebase(urlOfExercise);

            return ref.remove();
        };
        // ~~~ self.exerciseDelete ~~~

        // редактирование пользователя
        self.accountProfileEdit = function ( _userid, _userData ) {
            usersRef.child( _userid ).set( _userData );
        };
        // ~~~ self.accountProfileEdit ~~~
    }

})();

