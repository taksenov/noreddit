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

        // получение списка всех постов
        self.getAllPosts = function(call_back){
            var allPostsArr = $firebaseArray( allPostsRef );

            return allPostsArr.$loaded( call_back );
        };
        // ~~~ self.getUserExercises ~~~


        //var allPostsAndComments = {

        self.getAllPostsAndComments = function(){

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

            //var defer = $q.defer();

            var allPostsArr = $firebaseArray( allPostsRef );

            $log.debug( 'allPostsArr =', allPostsArr );

            return allPostsArr
                .$loaded()
                .then(
                    function ( _data ) {
                        var posts = {};

                        $log.debug( '_data =', _data );

                        for(var i = 0; i<_data.length; i++) {
//                            var value = data[i].$value;
//                            posts[value] = Post.get(value);

                            allPostsRef.child( _data[i].$id ).once( 'value', function( _postsSnap ) {
                                allCommentsRef.child( _data[i].$id ).once( 'value', function( _commentsSnap ) {
                                    posts[i] = extend({}, _postsSnap.val(), _commentsSnap.val())

                                    console.log( '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~' );
                                    console.log( posts[i] );
                                    console.log( '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~' );
                                });
                            });


                            $log.debug( '_data[i].$id =', _data[i].$id );

                        }
                        //defer.resolve(posts);
                    }



                );

            //$log.debug( 'defer =', defer );
            //return defer.promise;
        }; // ~~~ self.getAllPostsAndComments ~~~




        // добавление нового упражнения
        self.exerciseAdd = function ( _exercise ) {
            _exercise.ownerid = $rootScope.currentUser.id;
            _exercise.isWorkout = false;
            $log.debug( 'Картинка в новом упражнении =', _exercise.img        );
            if ( typeof( _exercise.img ) === 'undefined' ||
                 _exercise.img  === '' ) {
                _exercise.img = '../img/ngNoReddit-exercises-001.jpg'
            }

            exercisesRef.push( _exercise );
        };
        // ~~~ self.exerciseAdd ~~~

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

