CBApp.controller('ProfileController', ['$rootScope', '$scope', 'userLoggedIn', 'APIService', '$location',
    function($rootScope, $scope, userLoggedIn, APIService, $location) {

        //CHECKING USER AUTHENTICATION
        if (!userLoggedIn.data.nickname) {
            $location.path('/login');
        }

        //GETTING USERDATA
        $scope.currentUser = userLoggedIn.data;

        //GETTING USERS POSTS
        APIService.getUsersPosts($scope.currentUser.id).success(function (posts) {
            posts.forEach(function(post) {
                if (post.comImg === null) {
                    post.comImg = "https://s-media-cache-ak0.pinimg.com/236x/d3/92/bd/d392bd3c66f992f3d8d35d66f1e51971.jpg";
                }
            })
            $scope.usersPosts = posts;
        });

        //GETTING USERPICTURE
        if ($scope.currentUser.fbId !== 'not_set') {
            FB.api('/me', {
                fields: 'picture.width(9999).height(9999)'
            }, function (response) {
                if (!response || response.error) {
                    console.log(response.error);
                } else {
                    var elem = document.getElementById("img-container");
                    if (elem) {
                        elem.innerHTML = '<img src="' + response.picture.data.url + '" class="img-responsive img-rounded">';
                    }
                }
            });
        }

        // USER INFO UPDATE
        $scope.updatePassword = function() {
                $scope.currentUser.password = $scope.newPass;
                if ($scope.currentUser.nickname !== null && $scope.currentUser.nickname !== '' && $scope.currentUser.nickname.length > 2) {
                    APIService.updatePassword($scope.currentUser).success(function (user) {
                        $scope.errorMessage = null;
                        $scope.confirmPassword = '';
                        $scope.newPass = '';
                        $scope.message  = 'Update successful!';
                        $scope.currentUser = user;
                        $rootScope.profile = user;
                        $cookies.putObject('profile', user);
                    }).error(function(error) {
                        $scope.errorMessage = error.error;
                        $scope.message = null;
                    });
                }
        }

        // HIDE POSTS (FOR MOBILE VIEWS)
        $scope.hidePosts = function() {
            var elem = document.getElementById("post-container");
            if (elem.style.display === "none") {
                $("#post-container").show("slow");
            } else {
                $("#post-container").hide("slow");
            }
        }

}])
