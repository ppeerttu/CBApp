CBApp.controller('MainController', ['$scope', '$location', 'userLoggedIn',
    function ($scope, $location, userLoggedIn) {
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


}]);


