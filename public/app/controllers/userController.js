CBApp.controller('UserController',['$rootScope', '$scope', 'APIService', '$location', 'userLoggedIn', '$cookies',
    function ($rootScope, $scope, APIService, $location, userLoggedIn, $cookies) {
    //CHECKING USER AUTHENTICATION
    if (userLoggedIn.data.nickname) {
        $location.path('/main');
    }

    //REDIRECT FUNCTION FOR REGISTER-TEMPLATE'S BACK -BUTTON
    $scope.redirect = function () {
        $location.path('/login');
    };

    //LOGIN-FUNCTION FOR FACEBOOK AUTHENTICATION
    $scope.onFBlogin = function () {
        FB.login(function (response) {
            if (response.authResponse) {
                console.log()
                FB.api('/me', {
                    fields: ['first_name', 'last_name', 'email']
                }, function (response) {
                    console.log(response);
                    var newUser = {
                        firstName: response.first_name,
                        lastName: response.last_name,
                        nickname: response.first_name,
                        fbId: response.id,
                        email: response.email
                    };
                    APIService.loginFB(newUser).success(function (user) {
                        $rootScope.profile = user;
                        $rootScope.profile.RoomId = null;
                        $cookies.putObject('profile', $rootScope.profile);
                        $location.path('/main');
                    });
                });
            }
        }, {scope: 'public_profile,email'});
    };

    //REGISTER FUNCTION TO REGISTER VIA EMAIL
    $scope.register = function () {
        if (typeof $scope.newUser !== 'undefined') {
            if ($scope.newUser.firstName.length < 2 || $scope.newUser.nickname.length < 3 || $scope.newUser.password.length < 8) {
                console.log('User info not valid! Registration denied.');
            } else {
                if ($scope.newUser.lastName === 'undefined' || $scope.newUser.lastName === '' || $scope.newUser.lastName === null) {
                    $scope.newUser.lastName = 'not_set';
                }
                $scope.newUser.fbId = 'not_set';
                APIService.register($scope.newUser).success(function (user) {
                    $location.path('/login');
                }).error(function (error) {
                    $scope.regError = error.error;
                    $scope.newUser.lastName = '';
                });
            }
        }
    };

    // LOGINFUNCTION WITHOUT FACEBOOK AUTHENTICATION
    $scope.login = function () {
        if (typeof $scope.user !== 'undefined') {
            APIService.login($scope.user).success(function (user) {
                console.log(user);
                $rootScope.profile = user;
                $rootScope.profile.RoomId = null;
                $cookies.putObject('profile', $rootScope.profile);
                $location.path('/main');
            }).error(function (error) {
                $scope.errorText = error.error;
            });
        }
    };
}]);
