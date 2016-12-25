CBApp.service('APIService',['$http', function($http) {
    
    // ===============================
    // FOR CHAT
    
    this.addRoom = function (room) {
        return $http.post('/rooms', room);
    }
    
    this.getRoom = function (id) {
        var url = '/rooms/' + id;
        console.log('Request url: ' + url);
        return $http.get(url);
    }
    
    this.getRooms = function () {
        return $http.get('/rooms');
    }
    
    // ===============================
    // FOR USER MANAGEMENT
    
    this.register = function (user) {
        return $http.post('/users', user);
    }
    
    this.login = function (user) {
        return $http.post('/users/authenticate', user);
    }
    
    this.getUserLoggedIn = function() {
        return $http.get('/users/current-auth');
    }
    
    this.logout = function () {
        return $http.get('/users/logout');
    }
    
    // FB-USER AUTHENTICATION
    
    this.loginFB = function(user) {
        return $http.post('/users/fb_authenticate', user);
    }
    
}]);


