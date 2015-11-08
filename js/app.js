// MyChat App - Ionic & Firebase Demo

var firebaseUrl = "https://dazzling-heat-5766.firebaseio.com";

function onDeviceReady() {
    angular.bootstrap(document, ["mychat"]);
}
// 注册 onDeviceReady callback with deviceready event
document.addEventListener("deviceready", onDeviceReady, false);

// 'mychat.services' 定义在 services.js
// 'mychat.controllers' 定义在 controllers.js
// 其他在先于app.js导入的script
angular.module('mychat', ['ionic', 'firebase', 'angularMoment', 'mychat.controllers', 'mychat.services'])

.run(function ($ionicPlatform, $rootScope, $location, Auth, $ionicLoading) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        ionic.Platform.fullScreen();
        $rootScope.firebaseUrl = firebaseUrl;
        $rootScope.displayName = null;
        //监听登录状态
        Auth.$onAuth(function (authData) {
            if (authData) {
                console.log("Logged in as:", authData.uid);
            } else {
                console.log("Logged out");
                $ionicLoading.hide();
                $location.path('/login');
            }
        });

        $rootScope.logout = function () {
            console.log("Logging out from the app");
            $ionicLoading.show({
                template: 'Logging Out...'
            });
            Auth.$unauth();
        }


        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/login");
            }
        });
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    console.log("setting config");
    // 通过$stateProvider设置各个状态，并为每个状态分配视图控制器
    // 所有控制器在 controllers.js
    $stateProvider

    // 注册状态
    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl',
        resolve: {
            // controller will not be loaded until $waitForAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
                function (Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
        }]
        }
    })


    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html",
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
                function (Auth) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return Auth.$requireAuth();
      }]
        }
    })



    .state('tab.rooms', {
        url: '/rooms',
        views: {
            'tab-rooms': {
                templateUrl: 'templates/tab-rooms.html',
                controller: 'RoomsCtrl'
            }
        }
    })

    .state('tab.chat', {
        url: '/chat/:roomId',
        views: {
            'tab-chat': {
                templateUrl: 'templates/tab-chat.html',
                controller: 'ChatCtrl'
            }
        }
    })

    // 找不到则跳转到该状态
    $urlRouterProvider.otherwise('/login');

});