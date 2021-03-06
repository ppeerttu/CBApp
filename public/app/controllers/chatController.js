CBApp.controller('ChatController',
    ['$rootScope', '$scope', 'Socket', 'APIService', '$location', 'userLoggedIn',
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
        var result = 0;
        for (var i = 0; i < $scope.elementsPrinted.length; i++) {
            if ($scope.elementsPrinted[i].id === data.id) {
                result++;
            }
        }
        if (result === 0) {
            $scope.elementsPrinted.push({id: data.id});
            var url = '/' + data.fbId;
            FB.api(url, {
                fields: 'picture.type(small)'
            }, function (response) {
                if (!response || response.error) {
                    console.log(response.error);
                } else {
                    var dom_div1 = document.createElement("div");
                    var dom_div2 = document.createElement("div");
                    dom_div1.className = "participant-gray-lighter";
                    dom_div2.className = "row";
                    dom_div1.id = data.id;
                    var dom_p = document.createElement("p");
                    dom_p.className = "text-primary col-xs-8 col-sm-8 col-md-8 part-nick";
                    var strong = document.createElement("strong");
                    var node = document.createTextNode(data.nickname);
                    strong.appendChild(node);
                    dom_p.appendChild(strong);
                    var dom_img = document.createElement("img");
                    dom_img.src = response.picture.data.url;
                    dom_img.className = "img-circle";
                    var dom_imgdiv = document.createElement("div");
                    dom_imgdiv.className = "col-xs-4 col-sm-4 col-md-4";
                    dom_imgdiv.appendChild(dom_img);
                    dom_div2.appendChild(dom_imgdiv);
                    dom_div2.appendChild(dom_p);
                    dom_div1.appendChild(dom_div2);
                    addElement(dom_div1);
                }
            });
        }
    }

    //CREATES ELEMENT WITH USER'S NICKNAME AND CALLS
    //FUNCTION addElement(elem) WITH CREATED ELEMENT ON PARMAETER
    function addParticipant(data) {
        var result = 0;
        for (var i = 0; i < $scope.elementsPrinted.length; i++) {
            if ($scope.elementsPrinted[i].id === data.id) {
                result++;
            }
        }
        if (result === 0) {
            $scope.elementsPrinted.push({id: data.id});
            var dom_div1 = document.createElement("div");
            var dom_div2 = document.createElement("div");
            dom_div1.className = "participant-gray-lighter";
            dom_div2.className = "row";
            dom_div1.id = data.id;
            var dom_imgdiv = document.createElement("div");
            dom_imgdiv.className = "col-xs-4 col-sm-4 col-md-4";
            dom_imgdiv.id = "stuff-element";
            var dom_p = document.createElement("p");
            dom_p.className = "text-primary col-xs-8 col-sm-8 col-md-8 part-nick";
            var strong = document.createElement("strong");
            var node = document.createTextNode(data.nickname);
            strong.appendChild(node);
            dom_p.appendChild(strong);
            dom_div2.appendChild(dom_imgdiv);
            dom_div2.appendChild(dom_p);
            dom_div1.appendChild(dom_div2);
            addElement(dom_div1);
        }
    }

    // GETS ELEMENT ON PARAMETER AND ADDS IT IN VIEW'S ELEMENT WITH ID #users-fixed
    function addElement(elem) {
        var participants = document.getElementById("users-fixed");
        participants.appendChild(elem);

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
        var index = 0;
        for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i].id === data.id) {
                index++;
            }
        }
        if (index === 0) {
            $scope.users.push({nickname: data.nickname, id: data.id});
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
            return object.id === data.id;
        });
        var index = $scope.users.indexOf(removed);
        if (index < 0) {
            $scope.users.splice(index, 1);
        }
        var index2 = $scope.elementsPrinted.indexOf({id: data.id});
        if (index2 < 0) {
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
        var index = 0;
        for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i].id === data.id) {
                index++;
            }
        }
        if (index === 0) {
            $scope.users.push({nickname: data.nickname, id: data.id});
            if (data.fbId !== 'not_set' && data.fbId !== null && $scope.currentUser.fbId !== 'not_set' && $scope.currentUser.fbId !== null) {
                addParticipantWithPhoto(data);
            } else {
                addParticipant(data);
            }
        }
    });

    //UPDATING ROOMS, CALLED WHEN SOMEONE CREATES NEW ROOM
    Socket.on('refresh:rooms', function () {
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
            $scope.users.splice(0, $scope.users.length);
            $scope.messages = [];
            $scope.errorMessage = null;
            $rootScope.profile.RoomId = null;
            $scope.elementsPrinted.length = 0;
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
            $scope.elementsPrinted.length = 0;
            APIService.addRoom(room).success(function (room) {
                $scope.roomName = '';
                Socket.emit('room:join', {RoomId: room.id, nickname: $scope.currentUser.nickname});
                Socket.emit('new:room');
                $scope.room = room;
                $scope.inRoom = true;
                $scope.users.splice(0, $scope.users.length);
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
            $scope.elementsPrinted.length = 0;
            APIService.getRoom(id).success(function (room) {
                $scope.room = room;
                $scope.inRoom = true;
                $scope.users.splice(0, $scope.users.length);
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
    var locationChange = $scope.$on('$locationChangeStart', function (event, next, current) {
        $scope.leaveRoom();
        $scope.users = undefined;
        $scope.elementsPrinted = undefined;
    });

    $scope.$on('$destroy', function() {
        locationChange();
    });

    window.onbeforeunload = function (e) {
        $scope.leaveRoom();
    };
}]);
