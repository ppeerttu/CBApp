CBApp.controller('MarkdownController', ['$scope', 'userLoggedIn', '$location', 'APIService',
    function($scope, userLoggedIn, $location, APIService) {

    if (!userLoggedIn.data.nickname) {
        $location.path('/login');
    }
    // setters
    $scope.currentUser = userLoggedIn.data;
    $scope.sendObj = {comImg: ''};

    // load markdown editor into div with id markdown-trumb
    $('#markdown-trumb').trumbowyg({
        resetCss: true,
        autogrow: true,
        removeformatPasted: true
    });

    // shows contents of markdown editor on view
    $scope.showResult = function() {
        var elem = document.getElementById("preview-markdown");
        elem.innerHTML = $('#markdown-trumb').trumbowyg('html');
        $scope.currentDate = new Date();
        if (document.getElementById("preview-container").style.display === "none") {
            if ($scope.sendObj.comImg === '') {
                $scope.sendObj.comImg = "https://s-media-cache-ak0.pinimg.com/236x/d3/92/bd/d392bd3c66f992f3d8d35d66f1e51971.jpg";
            }
            $("#preview-container").show("slow");
        }
    }

    // hides contents from view
    $scope.hideResult = function() {
        var elem = document.getElementById("preview-container");
        if (elem.style.display !== "none") {
            if ($scope.sendObj.comImg === "https://s-media-cache-ak0.pinimg.com/236x/d3/92/bd/d392bd3c66f992f3d8d35d66f1e51971.jpg") {
                $scope.sendObj.comImg = '';
            }
            $("#preview-container").hide("slow");
        }
    }

    // sends post to API, on success relocates to /main
    // on unsuccess shows errormessage
    $scope.sendPost = function() {
        var postContent = $('#markdown-trumb').trumbowyg('html');
        $scope.errorMessage = null;
        $scope.sendObj.content = postContent;
        $scope.sendObj.UserId  = $scope.currentUser.id;
        if ($scope.sendObj.comImg === '' || $scope.sendObj.comImg === "https://s-media-cache-ak0.pinimg.com/236x/d3/92/bd/d392bd3c66f992f3d8d35d66f1e51971.jpg") {
            $scope.sendObj.comImg = null;
        }
        if ($scope.sendObj.title.length < 100) {
            APIService.createPost($scope.sendObj).success(function () {
                $('#markdown-trumb').trumbowyg('html', "");
                $scope.sendObj.title = "";
                $location.path('/main');
            }).error(function (error) {
                console.log(error);
                $scope.errorMessage = error.error;
            })
        }
    }

}])
