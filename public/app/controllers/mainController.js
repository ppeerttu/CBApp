CBApp.controller('MainController', ['$rootScope', '$scope', '$location', 'userLoggedIn', 'APIService',
    function ($rootScope, $scope, $location, userLoggedIn, APIService) {
    //CHECKING USER AUTHENTICATION
    if (!userLoggedIn.data.nickname) {
        $location.path('/login');
    }

    //GETTING USERDATA
    $scope.currentUser = userLoggedIn.data;

    //GETTING USERPICTURE
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

    $scope.updatePassword = function() {
            $scope.currentUser.password = $scope.newPass;
            if ($scope.currentUser.nickname !== null && $scope.currentUser.nickname !== '' && $scope.currentUser.nickname.length > 2) {
                APIService.updatePassword($scope.currentUser).success(function (user) {
                    $scope.confirmPassword = '';
                    $scope.newPass = '';
                    $scope.message  = 'Update successful!';
                    $scope.currentUser = user;
                    $rootScope.profile = user;
                    $cookies.putObject('profile', user);
                }).error(function(error) {
                    $scope.errorMessage = error.error;
                });
            }
    }
}]);
