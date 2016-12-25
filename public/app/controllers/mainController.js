CBApp.controller('MainController', ['$scope', '$location', 'userLoggedIn', 'APIService',
    function ($scope, $location, userLoggedIn, APIService) {

    if (!userLoggedIn.data.nickname) {
        $location.path('/login');
    }

    $scope.currentUser = userLoggedIn.data;

    APIService.getRooms().success(function (rooms) {
        $scope.rooms = rooms;
    });

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


}]);


