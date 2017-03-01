CBApp.controller('BlogController', ['$scope', 'APIService', '$routeParams', 'userLoggedIn', '$location',
    function($scope, APIService, $routeParams, userLoggedIn, $location) {

        // Check out whether user is trying to view some post
        // or scroll all posts on mainblogs -site
        // If user isn't logged in, user can't scroll other posts
        $scope.newReply = {};
        $scope.searchTerm = null;
        $scope.searchPosts = null;
        $scope.searchError = null;
        if (typeof $routeParams.id !== 'undefined') {
            APIService.getPost({
                PostId: $routeParams.id,
                UserId: $routeParams.UserId
            }).success(function(post) {
                $scope.post = post;
                $scope.countReplies = post.Replies.length;
                document.getElementById("content-container").innerHTML = post.content;
                $scope.postOwner = (post.UserId === userLoggedIn.data.id) ? true : false;
            }).error(function(error) {
                console.log(error);
                $location.path('/main');
            });
        }  else {
            if (!userLoggedIn.data.nickname) {
                $location.path('/login');
            } else {
                APIService.getRecent().success(function (posts) {
                    posts.forEach(function(post) {
                        if (post.comImg === null) {
                            post.comImg = "https://s-media-cache-ak0.pinimg.com/236x/d3/92/bd/d392bd3c66f992f3d8d35d66f1e51971.jpg";
                        }
                    })
                    $scope.recentPosts = posts;
                });

                APIService.getUsersPosts(userLoggedIn.data.id).success(function (userposts) {
                    userposts.forEach(function(post) {
                        if (post.comImg === null) {
                            post.comImg = "https://s-media-cache-ak0.pinimg.com/236x/d3/92/bd/d392bd3c66f992f3d8d35d66f1e51971.jpg";
                        }
                    })
                    $scope.usersPosts = userposts;
                });
            }
        }

        // Sends replymessage to API, on successfull call reloads page
        // on unsuccessfull call shows errormessage
        $scope.sendReply = function () {
            console.log($scope.newReply);
            if (typeof $scope.newReply.content !== 'undefined' && $scope.newReply.content !== null && $scope.newReply.content.length > 1) {
                $scope.errorMessage = null;
                $scope.newReply.UserId = userLoggedIn.data.id;
                $scope.newReply.PostId = $scope.post.id;
                APIService.postReply($scope.newReply).success(function() {
                    location.reload();
                }).error(function(error) {
                    $scope.errorMessage = error.error;
                });
            } else {
                $scope.errorMessage = 'Content of your reply was not worth posting and wasting storage';
            }
        }

        // sends delete request to API, on success relocates to /main
        // on unsuccess shows errormessage
        $scope.deletePost = function() {
            $scope.deleteError = null;
            if (confirm("Are you sure?") && $scope.post.UserId === userLoggedIn.data.id) {
                APIService.deletePost($scope.post.id).success(function() {
                    $location.path('/main');
                }).error(function(error) {
                    $scope.deleteError= error.error;
                });
            }
        }

        // search post with inserted search term
        // if error occurs, throw it at the user
        $scope.searchPost = function() {
            APIService.searchPost($scope.searchTerm).success(function(posts) {
                console.log(posts);
                $scope.searchPosts = posts;
            }).error(function(error) {
                $scope.searchError = error.error;
                $scope.searchPosts = null;
            });
        }


}]);
