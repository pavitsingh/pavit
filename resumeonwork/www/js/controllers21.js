angular.module('starter.controllers',[])


// WALKTHROUGH$scope,$state,$ionicLoading,$timeout,$rootScope,$ionicPopup,$cordovaDevice
.controller('AppController', function($scope, $window, $state, $http, $location, $cordovaFacebook, $cordovaGooglePlus,$cordovaOauth, $ionicLoading,$ionicPopup,$cordovaDevice,$timeout,$rootScope){

//var str = $location.absUrl();
//var res = str.split("?");
//var reqstr = res[1];
//var spstr = reqstr.split("#");
var deviceid = "";
var devicename = "";

$timeout( function(){ $scope.callAtTimeout(); }, 1000);
	
$scope.callAtTimeout=function()
{
	
	$scope.uuid	=	"A100003BC4B544";
	devicename	=	"android";
	deviceid	=	$scope.uuid;
	$http.post("http://www.resumeon.com/resumeonapp/newresumeonapp/cellgell/services/userexist.php?devicename=android&deviceid="+deviceid).success(function(response) {
		console.log(response);
		if(response=='3')
		{
			$state.go("tinder-cards");
		}
		else
		{
			$state.go("signUp");
		}
	});
}


})
.controller('SignUpController', function($scope, $cordovaFacebook, $cordovaGooglePlus, $ionicLoading,  $location, $http) {
	/*
	 * Learn how facebooks graph api works: https://developers.facebook.com/docs/graph-api/quickstart/v2.2
	 * The array params "public_profile", "email", "user_friends" are the permissions / data that the app is trying to access.
	*/
	
	/*var str = $location.absUrl();
	var res = str.split("?");
	var reqstr = res[1];
	var spstr = reqstr.split("#");*/
	
	$scope.fbLogin = function(){

		$cordovaFacebook.login(["public_profile", "email", "user_friends"])
    .then(function(success) {
    	/*
    	 * Get user data here. 
    	 * For more, explore the graph api explorer here: https://developers.facebook.com/tools/explorer/
    	 * "me" refers to the user who logged in. Dont confuse it as some hardcoded string variable. 
    	 * 
    	*/
    	//To know more available fields go to https://developers.facebook.com/tools/explorer/
		$cordovaFacebook.api("me?fields=id,name,picture,email,gender", [])
    	.then(function(result){
    		
			alert(result.id+result.name+result.picture.data.url+result.email+result.gender);
				
    	}, function(error){
    		alert("Network problem.\nTry again.");
    		// Error message
    	})
      
    }, function (error) {
    alert("Network problem.\nTry again.");
      // Facebook returns error message due to which login was cancelled.
      // Depending on your platform show the message inside the appropriate UI widget
      // For example, show the error message inside a toast notification on Android
    });

	}

	/*
	 * Google login
	*/

	$scope.googleLogin = function(){

		$ionicLoading.show({template: 'Loading...'}); 
		/*
		 * Google login. This requires an API key if the platform is "IOS".
		 * Example: $cordovaGooglePlus.login('yourApiKey')
		*/
		$cordovaGooglePlus.login('AIzaSyAYe5fLPpM0r_xT_TkIQTnpSsX5CR7DTkg')
		.then(function(data){
			
			alert(data.userId+data.displayName+data.imageUrl+data.email+data.gender);

			$ionicLoading.hide();
			
		}, function(error){
			alert("Network error.\nTry again.");
			// Google returns error message due to which login was cancelled.
			// Depending on your platform show the message inside the appropriate UI widget
			// For example, show the error message inside a toast notification on Android
			$ionicLoading.hide();

		});
	}
	
	
})
// TINDER CARDS
.controller('TinderCardsCtrl', function() {
	console.log("hi");
	
	
})
;
