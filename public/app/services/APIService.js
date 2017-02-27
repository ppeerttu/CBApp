CBApp.service('APIService',['$http', function($http) {

    // ===============================
    // FOR CHAT

    this.addRoom = function (room) {
        return $http.post('/rooms', room);
    }

    this.getRoom = function (id) {
        var url = '/rooms/' + id;
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

    this.updatePassword = function (user) {
        return $http.put('/users/update', user);
    }

    // FB-USER AUTHENTICATION

    this.loginFB = function(user) {
        return $http.post('/users/fb_authenticate', user);
    }

    // ==================================
    // FOR BLOG MANAGEMENT

    this.createPost = function(post) {
        return $http.post('/posts/create', post);
    }

    this.getUsersPosts = function(userId) {
        var url = '/posts/user/' + userId;
        return $http.get(url);
    }

    this.getPost = function(data) {
        var url = '/posts/post/' + data.UserId + '/' + data.PostId;
        return $http.get(url);
    }

    this.deletePost = function(id) {
        var url = '/posts/' + id;
        return $http.delete(url);
    }

    this.getRecent = function() {
        return $http.get('/posts/recent');
    }

    this.postReply = function(reply) {
        var url = '/posts/' + reply.PostId + '/reply'
        return $http.post(url, reply);
    }

    this.deletePost = function(id) {
        var url = '/posts/' + id;
        return $http.delete(url);
    }

    this.searchPost = function(searchTerm) {
        var url = '/posts/search/' + searchTerm;
        return $http.get(url);
    }

}]);
