var CBApp = angular.module('CBApp', ['ngRoute', 'validation.match','ngCookies']);

CBApp.config(['$routeProvider', function ($routeProvider) {
    // Configuring single-page routes
    // Resolve checks whether user has authentication or not
    $routeProvider
            .when('/login', {
                controller: 'UserController',
                templateUrl: 'app/views/login.html',
                resolve: {
                    userLoggedIn: ['$rootScope', 'APIService', function ($rootScope, APIService) {
                        return APIService.getUserLoggedIn().success(function (user) {
                            $rootScope.userLoggedIn = user.nickname ? user : null;
                        });
                    }]
                }
            })
            .when('/register', {
                controller: 'UserController',
                templateUrl: 'app/views/register.html',
                resolve: {
                    userLoggedIn: ['$rootScope', 'APIService', function ($rootScope, APIService) {
                        return APIService.getUserLoggedIn().success(function (user) {
                            $rootScope.userLoggedIn = user.nickname ? user : null;
                        });
                    }]
                }
            })
            .when('/main', {
                controller: 'MainController',
                templateUrl: 'app/views/main.html',
                resolve: {
                    userLoggedIn: ['$rootScope', 'APIService', function ($rootScope, APIService) {
                        return APIService.getUserLoggedIn().success(function (user) {
                            $rootScope.userLoggedIn = user.nickname ? user : null;
                        });
                    }]
                }
            })
            .when('/profile', {
                controller: 'MainController',
                templateUrl: 'app/views/profile.html',
                resolve: {
                    userLoggedIn: ['$rootScope', 'APIService', function ($rootScope, APIService) {
                        return APIService.getUserLoggedIn().success(function (user) {
                            $rootScope.userLoggedIn = user.nickname ? user : null;
                        });
                    }]
                }
            })
            .when('/chat', {
                controller: 'ChatController',
                templateUrl: 'app/views/chat.html',
                resolve: {
                    userLoggedIn: ['$rootScope', 'APIService', function ($rootScope, APIService) {
                        return APIService.getUserLoggedIn().success(function (user) {
                            $rootScope.userLoggedIn = user.nickname ? user : null;
                        });
                    }]
                }
            })
            .when('/about', {
                templateUrl: 'app/views/about.html'
            })
            .otherwise({
                redirectTo: '/login'
            });
}]);

CBApp.run(['$rootScope', '$location', 'APIService', '$cookies', function ($rootScope, $location, APIService, $cookies) {
    
    // Getting user info from cookies in case user has refreshed page
    var cookies = $cookies.get('profile');
    if (typeof cookies !== 'undefined' && cookies !== null) {
        var parsedCookies = JSON.parse(cookies);
        $rootScope.profile = parsedCookies;
    }
    
    // Providing logout -method for root element
    $rootScope.logOut = function () {
        APIService.logout().success(function () {
            $location.path('/login');
            $rootScope.profile = null;
        });
        FB.logout(function () {
        });
        $cookies.remove('profile');
    };
}]);

