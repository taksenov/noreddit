/**
 * Created by taksenov@gmail.com on 18.07.2015.
 */

;(function(){
    'use strict';

    angular
        .module( 'allPostsAndComments.factory', [ 'firebase' ] )
        .factory( 'AllPostsAndCommentsFactory', allPostsAndCommentsFactory )
    ;

    allPostsAndCommentsFactory.$inject = [ 'FIREBASE_URL', '$firebaseObject',
                          '$firebaseArray', '$log',
                          '$rootScope', '$q' ];

    function allPostsAndCommentsFactory( FIREBASE_URL, $firebaseObject,
                        $firebaseArray, $log,
                        $rootScope, $q ) {

        var ref = new Firebase( FIREBASE_URL );
        var usersRef = ref.child('users');
        var allPostsRef = ref.child( 'posts' );
        var allCommentsRef = ref.child( 'comments' );

        var self = this;
        var allPostsAndComments = {

            getAllPostsAndComments: function () {

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

                var defer = $q.defer();

                var allPostsArr = $firebaseArray(allPostsRef);

                $log.debug('allPostsArr =', allPostsArr);

                allPostsArr
                    .$loaded()
                    .then(
                    function (_data) {
                        var posts = {};

                        $log.debug('_data =', _data);

                        for (var i = 0; i < _data.length; i++) {
                            //                            var value = data[i].$value;
                            //                            posts[value] = Post.get(value);

                            allPostsRef.child(_data[i].$id).once('value', function (_postsSnap) {
                                allCommentsRef.child(_data[i].$id).once('value', function (_commentsSnap) {
                                    posts[i] = extend({}, _postsSnap.val(), _commentsSnap.val());

                                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                                    console.log(posts[i]);
                                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                                });
                            });


                            $log.debug('_data[i].$id =', _data[i].$id);

                        }
                        defer.resolve(posts);
                    }
                ); // then

                $log.debug('defer =', defer);
                return defer.promise;
            } // ~~~ getAllPostsAndComments ~~~

        };

    return allPostsAndComments;

    }





})();

