CBApp.controller('MainController', ['$scope', '$location', 'userLoggedIn', 'APIService',
    function ($scope, $location, userLoggedIn, APIService) {
    //CHECKING USER AUTHENTICATION
    if (!userLoggedIn.data.nickname) {
        $location.path('/login');
    }


    //GETTING MOST RECENT BLOGPOSTS
    APIService.getRecent().success(function (posts) {
        posts.forEach(function(post) {
            if (post.comImg === null) {
                post.comImg = "https://s-media-cache-ak0.pinimg.com/236x/d3/92/bd/d392bd3c66f992f3d8d35d66f1e51971.jpg";
            }
        })
        $scope.posts = posts;
    });

    //Self-explaining method
    $scope.locateToChat = function() {
        $location.path('/chat');
    }

}]);
