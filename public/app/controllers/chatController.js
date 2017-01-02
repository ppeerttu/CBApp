CBApp.controller('ChatController',['$rootScope', '$scope', 'Socket', 'APIService', '$location', 'userLoggedIn',
    function ($rootScope, $scope, Socket, APIService, $location, userLoggedIn) {

    //CHECKING USER AUTHENTICATION
    if (!userLoggedIn.data.nickname) {
        $location.path('/login');
    }


    //MAKING BASIC SETUP FOR SCOPE VARIABLES
    $scope.currentUser = userLoggedIn.data;
    $scope.messages = [];
    $scope.room = null;
    $scope.inRoom = false;
    $scope.users = [];
    $scope.elementsPrinted = [];
    APIService.getRooms().success(function (rooms) {
        $scope.rooms = rooms;
    });

    //FUNCTION FOR CREATING ELEMENT WITH USER'S NICKNAME AND FACEBOOK PROFILE PHOTO
    //CALLS addElement(elem) WITH CREATED ELEMENT ON PARAMETER
    function addParticipantWithPhoto(data) {
        var result = $.grep($scope.elementsPrinted, function (e) {
            return e.id === data.id;
        });
        if (result.length === 0) {
            $scope.elementsPrinted.push({id: data.id});
            var url = '/' + data.fbId;
            FB.api(url, {
                fields: 'picture.type(small)'
            }, function (response) {
                if (!response || response.error) {
                    console.log(response.error);
                } else {
                    var dom_div = document.createElement("div");
                    dom_div.className = "row";
                    dom_div.id = data.id;
                    var dom_p = document.createElement("p");
                    dom_p.className = "text-primary col-xs-9 col-sm-9 col-md-9";
                    var strong = document.createElement("strong");
                    var node = document.createTextNode(data.nickname);
                    strong.appendChild(node);
                    dom_p.appendChild(strong);
                    var dom_img = document.createElement("img");
                    dom_img.src = response.picture.data.url;
                    dom_img.className = "img-circle";
                    var dom_imgdiv = document.createElement("div");
                    dom_imgdiv.className = "col-xs-3 col-sm-3 col-md-3";
                    dom_imgdiv.appendChild(dom_img);
                    dom_div.appendChild(dom_imgdiv);
                    dom_div.appendChild(dom_p);
                    addElement(dom_div);
                }
            });
        }
    }

    //CREATES ELEMENT WITH USER'S NICKNAME AND CALLS
    //FUNCTION addElement(elem) WITH CREATED ELEMENT ON PARMAETER
    function addParticipant(data) {
        var result = $.grep($scope.elementsPrinted, function (e) {
            return e.id === data.id;
        });
        if (result.length === 0) {
            $scope.elementsPrinted.push({id: data.id});
            var dom_div = document.createElement("div");
            dom_div.className = "row";
            dom_div.id = data.id;
            var dom_imgdiv = document.createElement("div");
            dom_imgdiv.className = "col-xs-3 col-sm-3 col-md-3";
            dom_imgdiv.id = "stuff-element";
            var dom_p = document.createElement("p");
            dom_p.className = "text-primary col-xs-9 col-sm-9 col-md-9";
            var strong = document.createElement("strong");
            var node = document.createTextNode(data.nickname);
            strong.appendChild(node);
            dom_p.appendChild(strong);
            dom_div.appendChild(dom_imgdiv);
            dom_div.appendChild(dom_p);
            addElement(dom_div);
        }
    }

    // GETS ELEMENT ON PARAMETER AND ADDS IT IN VIEW'S ELEMENT WITH ID #users-fixed
    function addElement(elem) {
        var users = document.getElementById("users-fixed");
        users.appendChild(elem);

    }

    // ==================================================================================
    // REACTING TO SERVER-SIDE


    //ADDING NEW MESSAGE TO SCOPE AND SCROLLING WINDOW DOWN
    Socket.on('send:message', function (message) {
        $scope.messages.push(message);
        var elem = document.getElementById('chat-messages');
        elem.scrollTop = elem.scrollHeight;
    });

    //ADDING NEW USER TO PARTICIPANTS AND SHOWING JOINING MESSAGE
    Socket.on('user:join', function (data) {
        $scope.messages.push({
            nickname: 'User ' + data.nickname + ' has joined.'
        });
        var search = {
            nickname: data.nickname,
            id: data.id
        };
        var index = $scope.users.indexOf(search);
        if (index < 0) {
            $scope.users.push(search);
            if (data.fbId !== 'not_set' && data.fbId !== null && $scope.currentUser.fbId !== 'not_set' && $scope.currentUser.fbId !== null) {
                addParticipantWithPhoto(data);
            } else {
                addParticipant(data);
            }
        }
    });

    //REMOVING LEFT USER FROM PARTICIPANTS AND SHOWING LEAVING MESSAGE
    Socket.on('user:left', function (data) {
        $scope.messages.push({
            nickname: 'User ' + data.nickname + ' has left room.'
        });
        var elem = document.getElementById("users-fixed");
        var leftElem = document.getElementById(data.id);
        elem.removeChild(leftElem);
        var removed = $scope.users.find(function (object) {
            return object.id = data.id;
        });
        var index = $scope.users.indexOf(removed);
        if (index < 0) {
            $scope.users.splice(index, 1);
        }
        var index = $scope.elementsPrinted.indexOf({id: data.id});
        if (index < 0) {
            $scope.elementsPrinted.splice(index, 1);
        }
    });

    //SENDING OWN DATA FOR NEW USER IN ROOM
    Socket.on('get:users', function (data) {
        data.nickname = $scope.currentUser.nickname;
        data.fbId = $scope.currentUser.fbId;
        data.id = $scope.currentUser.id;
        Socket.emit('get:user', data);
    });

    //ADDING NEW USER IN ROOM TO PARTICIPANTS-ELEMENT
    Socket.on('add:user', function (data) {
        var search = {
            nickname: data.nickname,
            id: data.id
        };
        var index = $scope.users.indexOf(search);
        if (index < 0) {
            $scope.users.push(search);
            if (data.fbId !== 'not_set' && data.fbId !== null && $scope.currentUser.fbId !== 'not_set' && $scope.currentUser.fbId !== null) {
                addParticipantWithPhoto(data);
            } else {
                addParticipant(data);
            }
        }
    });

    //UPDATING ROOMS, CALLED WHEN SOMEONE CREATES NEW ROOM
    Socket.on('refresh:rooms', function (data) {
        APIService.getRooms().success(function (rooms) {
            $scope.rooms = rooms;
        });
    });

    //====================================================================================
    // SENDING TO SERVER SIDE


    //SENDING MESSAGE TO ROOM'S USERS
    $scope.sendMessage = function () {
        if (typeof $scope.message !== 'undefined' && $scope.message.length > 0) {
            Socket.emit('room:sent', {
                content: $scope.message,
                nickname: $scope.currentUser.nickname,
                UserId: $scope.currentUser.id,
                RoomId: $scope.room.id
            });
            $scope.message = '';
        }
    };

    //LEAVING CURRENT ROOM
    $scope.leaveRoom = function () {
        if ($scope.room) {
            Socket.emit('room:leave', {nickname: $scope.currentUser.nickname, RoomId: $scope.room.id, id: $scope.currentUser.id});
            $scope.room = null;
            $scope.inRoom = false;
            $scope.users = [];
            $scope.messages = [];
            $scope.errorMessage = null;
            $rootScope.profile.RoomId = null;
        }
    };

    //CREATING NEW ROOM, IF USER IS ALREADY IN ROOM, ERROR MESSAGE WILL BE SHOWN IN VIEW
    $scope.createRoom = function () {
        var room = {name: $scope.roomName};
        if ($scope.room === null) {
            var elem = document.getElementById("users-fixed");
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }
            $scope.elementsPrinted = [];
            APIService.addRoom(room).success(function (room) {
                $scope.roomName = '';
                Socket.emit('room:join', {RoomId: room.id, nickname: $scope.currentUser.nickname});
                Socket.emit('new:room');
                $scope.room = room;
                $scope.inRoom = true;
                $scope.users;
                $scope.errorMessage = null;
                $rootScope.profile.RoomId = room.id;
            });

        } else {
            $scope.errorMessage = 'You can not join new room until you have left from current one.';
        }

    };

    //JOINING ROOM, IF USER IS ALREADY IN ROOM, ERROR MESSAGE WILL BE SHOWN IN VIEW
    $scope.joinRoom = function (id) {
        if ($scope.room === null) {
            var elem = document.getElementById("users-fixed");
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }
            $scope.elementsPrinted = [];
            APIService.getRoom(id).success(function (room) {
                $scope.room = room;
                $scope.inRoom = true;
                $scope.users = [];
                $scope.errorMessage = null;
                $rootScope.profile.RoomId = room.id;
                Socket.emit('room:join', {RoomId: room.id, nickname: $scope.currentUser.nickname, fbId: $scope.currentUser.fbId, id: $scope.currentUser.id});
            });
        } else {
            $scope.errorMessage = 'You can not join this room until you have left from current one.';
        }
    };

    //=================================================================================================
    //HELPER METHODS TO PREVENT USER LEAVING CHAT-PAGE WITHOUT LEAVING ROOM
    $scope.$on('$locationChangeStart', function (event, next, current) {
        $scope.leaveRoom();
    });

    window.onbeforeunload = function (e) {
        $scope.leaveRoom();
    };
}]);
