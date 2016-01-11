// Ionic Starter App

angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.config', 'starter.filters','ngCordova', 'underscore', 'ngMap', 'slugifier', 'ionic.contrib.ui.tinderCards'])

.run(['$ionicPlatform', function($ionicPlatform) {

  $ionicPlatform.on("deviceready", function(){
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    
  });
  $ionicPlatform.on("resume", function(){
    
  });
}])


.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider

  //INTRO
  .state('startup', {
    url: "/startup",
	cache:false,
    templateUrl: "templates/startup.html",
    controller: 'startappCtrl'
  })
  .state('walkthrough', {
    url: "/",
	cache:false,
    templateUrl: "templates/walkthrough.html",
    controller: 'WalkthroughCtrl'
  })
  .state('app', {
    url: "/app",
	cache:false,
    abstract: true,
    templateUrl: "templates/side-menu.html",
    controller: 'AppCtrl'
  })
  .state('app.profile', {
    url: "/profile",
	views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('app.tinder-cards', {
    url: "/layouts/tinder-cards/:Flag",
    cache:false,
    views: {
      'menuContent': {
        templateUrl: "templates/tinder-cards.html",
        controller: 'TinderCardsCtrl'
      }
    }
  })
	.state('app.search', {
    url: "/layouts/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: 'SearchCtrl'
      }
    }
  })
  .state('app.searchres', {
    url: "/layouts/searchres/:param",
    cache:false,
    views: {
      'menuContent': {
        templateUrl: "templates/searchres.html",
        controller: 'SearchresCtrl'
      }
    }
  })
  .state('app.saveforlater', {
    url: "/layouts/saveforlater/:jobid",
    cache:false,
    views: {
      'menuContent': {
        templateUrl: "templates/saveforlater.html",
        controller: 'SaveForLaterCards'
      }
    }
  })
	.state('app.jobdispapply', {
    url: "/jobdispapply/:postId",
    cache:false,
    views: {
      'menuContent': {
        templateUrl: "templates/jobdisplayapply.html",
        controller: 'JobdispapplyPostCtrl'
      }
    }
  })
  .state('app.viewlistapply', {
    url: "/viewlistapply/:postId",
    cache:false,
    views: {
      'menuContent': {
        templateUrl: "viewlistapply.html",
        controller: 'ShortListPostCtrl'
      }
    }
  })
   .state('app.wordpress', {
    url: "/wordpress",
    views: {
      'menuContent': {
        templateUrl: "templates/wordpress.html",
        controller: 'WordpressCtrl'
      }
    }
  })

  .state('app.post', {
    url: "/wordpress/:postId",
    views: {
      'menuContent': {
        templateUrl: "templates/wordpress_post.html",
        controller: 'WordpressPostCtrl'
      }
    }
  })
  .state('app.appliedjobs', {
    url: "/layouts/appliedjobs",
    views: {
      'menuContent': {
        templateUrl: "templates/appliedjobs.html",
        controller: 'AppliedJobs'
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/startup');
}]);
