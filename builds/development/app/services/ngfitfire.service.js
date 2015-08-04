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
                          '$rootScope', '$q',
                          'toastr' ];

    function ngfitfire( FIREBASE_URL, $firebaseObject,
                        $firebaseArray, $log,
                        $rootScope, $q,
                        toastr ){

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

        // выборка поста по ID
        self.getPostFromID = function ( _postID ) {
            var def = $q.defer();
            ref.child('posts').child( _postID ).once('value', function( snap ) {
                var records = {};
                records = extend({}, snap.val(), { 'postID': _postID } );
                def.resolve( records );
            });
            return def.promise;
        };
        // ~~~ self.getPosts

        // выборка комментариев по ID поста
        self.getCommentsFromID = function ( _postID ) {
            var def = $q.defer();
            ref.child('comments').child( _postID ).once('value', function( snap ) {
                def.resolve( snap.val() );
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
                        comments[ i++ ] = ( childSnap.val() );
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
        self.newPostAdd = function ( _newPostData, _ifAllSuccess ) {
            var newPostRef = allPostsRef.push( _newPostData );
            var postID = newPostRef.key();
            var onComplete = function(error) {
                if (error) {
                    $log.debug('addNewPost: Synchronization failed');
                    toastr.error('Попробуйте добавить новый пост позднее', 'Ошибка!');
                } else {
                    $log.debug('addNewPost: Synchronization succeeded');

                    $q.all( [
                            self.getPostFromID( postID ),
                            self.getCommentsFromID( postID ),
                            self.getAvatars() ] )
                    .then(
                        function ( _results ) {
                            $rootScope.allPosts2 = self.processingNewPostDataOfQALL( _results );
                            $rootScope.allPosts[$rootScope.allPosts.length] = $rootScope.allPosts2;

                            $log.debug( 'данные нового добавленного поста $rootScope.allPosts =', $rootScope.allPosts );
                            $log.debug( 'данные нового добавленного поста $rootScope.allPosts2 =', $rootScope.allPosts2 );
                            $log.debug( 'данные нового добавленного поста _results =', _results );
                            _ifAllSuccess();
                            toastr.success('Добавлен новый пост', 'Успех!');
                        }
                    );

                }
            }; // ~~~ onComplete ~~~

            allCommentsRef.child( postID ).set( { status: 'status=true' }, onComplete );
        };
        // ~~~ self.newPostAdd ~~~

        // добавление нового комментария
        self.newCommentAdd = function ( _newCommentData, _postID, _ifAllSuccess ) {
            var onComplete = function(error) {
                if (error) {
                    $log.debug('addNewComment: Synchronization failed');
                    toastr.error('Попробуйте добавить новый комментарий позднее', 'Ошибка!');
                } else {

                    $log.debug('addNewComment: Synchronization succeeded');
                    var commentID = newCommentRef.key();

                    $q.all( [
                            self.getAvatars() ] )
                    .then(
                        function ( _results ) {

                            // добаляем аватарку в объект с комментарием
                            if (  _newCommentData['ownerId'] !== undefined  ) {
                                _newCommentData['avatar'] = _results[0][ _newCommentData['ownerId'] ]['avatar'];
                            } // добаляем аватарку в объект с комментарием

                            // поиск объекта с постом в который добавлен комментарий в массиве объектов
                            for (var i = 0; i < $rootScope.allPosts.length; i++) {
                                if ( $rootScope.allPosts[i]['postID'] === _postID ) {
                                    $rootScope.allPosts[i]['comments'][commentID] = _newCommentData;
                                    //$rootScope.allPosts[i]['comments'] = extend( {}, $rootScope.allPosts[i]['comments'], $rootScope.allPosts[i]['comments'][commentID] );
                                    $log.debug('$rootScope.allPosts ' + i + ' =', $rootScope.allPosts[i] );
                                }
                            } // поиск объекта с постом

                            _ifAllSuccess();
                            toastr.success('Добавлен новый комментарий', 'Успех!', {
                                timeOut: 1000
                            });

                        }
                    );

                }
            };

            var newCommentRef = allCommentsRef.child( _postID ).push( _newCommentData, onComplete );

            $log.debug(
                'добавляемые данные',
                _newCommentData,
                'в пост =',
                _postID
            );

        };
        // ~~~ self.newCommentAdd ~~~

        // обработка данных всех постов в запросе $q.all
        self.processingMainDataOfQALL = function ( results ) {
            var posts = [];
            var allPosts = {};

            function isEmpty(obj) {
                return Object.keys(obj).length === 0;
            }

            for ( var i in results[1] ) {
                for ( var i1 in results[1][i]  ) {
                    // добаляем аватарку в объект
                    if (  results[2][ results[1][i][i1]['ownerId'] ] !== undefined  ) {
                        results[1][i][i1]['avatar'] = results[2][ results[1][i][i1]['ownerId'] ]['avatar'];
                    } // добаляем аватарку в объект

                    if ( results[1][i][i1] === 'status=true' ) {
                        delete results[1][i][i1];
                    }

                    // есть комменты или нет
                    isEmpty(results[1][i]) ? results[0][i]['nocomments'] = true : results[0][i]['nocomments'] = false;
                }
            } // обработка комментариев

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
            } // обработка постов

            return posts;
        };
        // ~~~ self.processingMainDataOfQALL ~~~

        // обработка данных нового добавленного поста в запросе $q.all
        self.processingNewPostDataOfQALL = function ( results ) {
            var posts = [];
            var allPosts = {};

            results[0]['nocomments'] = true;

            for ( var i in results[1] ) {
                for ( var i1 in results[1][i]  ) {
                    if ( results[1][i][i1] === 'status=true' ) {
                        //results[0][i]['nocomments'] = true;
                        delete results[1][i][i1];
                    }
                }
            } // обработка комментариев

            // добаляем аватарку в объект
            if (  results[2][ results[0]['ownerId'] ] !== undefined  ) {
                results[0]['avatar'] = results[2][ results[0]['ownerId'] ]['avatar'];
            } // добаляем аватарку в объект

            allPosts = {
                'comments': {}
            };
            posts = extend({}, results[0], allPosts );
            posts = extend({}, posts, { 'elementIndex': $rootScope.allPosts.length } );

            return posts;
        };
        // ~~~ self.processingMainDataOfQALL ~~~

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

