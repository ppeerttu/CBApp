CBApp.controller('UserController',['$rootScope', '$scope', 'APIService', '$location', 'userLoggedIn', '$cookies',
    function ($rootScope, $scope, APIService, $location, userLoggedIn, $cookies) {

    if (userLoggedIn.data.nickname) {
        $location.path('/main');
    }

    $scope.redirect = function () {
        $location.path('/login');
    };

    $scope.onFBlogin = function () {
        FB.login(function (response) {
            if (response.authResponse) {
                FB.api('/me', {
                    fields: ['first_name', 'last_name', 'email']
                }, function (response) {
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
        });
    };

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
                });
            }
        }
    };
    
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


