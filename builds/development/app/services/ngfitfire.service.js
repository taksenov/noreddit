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
                          '$rootScope' ];

    function ngfitfire( FIREBASE_URL, $firebaseObject,
                        $firebaseArray, $log,
                        $rootScope ){

        var self = this;

        var ref = new Firebase( FIREBASE_URL );
        var usersRef = ref.child('users');
        var allPostsRef = ref.child( 'posts' );

        // получение списка всех постов
        self.getAllPosts = function(call_back){
            var allPostsArr = $firebaseArray( allPostsRef );

            return allPostsArr.$loaded( call_back );
        };
        // ~~~ self.getUserExercises ~~~

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

