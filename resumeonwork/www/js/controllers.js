tpapp = angular.module('starter.controllers', [])

.controller('startappCtrl', function($scope, $state,$timeout,$cordovaDevice,$ionicLoading,$rootScope,$http) {
	$ionicLoading.show({
		content: 'Loading',
		animation: 'fade-in',
		showBackdrop: true,
		maxWidth: 200,
		showDelay: 0
	});
	var deviceid = "";
	var devicename = "";
	$timeout( function(){ $scope.callAtTimeout(); }, 1000);
	
	$scope.callAtTimeout=function()
	{
		$scope.uuid="A10000407587C1";
		/*try 
		{
			$scope.uuid = $cordovaDevice.getUUID();
		}
		catch (err) 
		{
			console.log("Error " + err.message);
			alert("error " + err.$$failure.message);
		}*/
		$rootScope.uuid = $scope.uuid;
		devicename	=	"android";
		deviceid	=	$scope.uuid;
		$http.post("http://www.resumeon.com/pavitresumeonapp/services/userexist.php?devicename=android&deviceid="+deviceid).success(function(response) {
			if(response=='3')
			{
				$ionicLoading.hide();
				$state.go("app.tinder-cards");
			}
			else
			{
				$ionicLoading.hide();
				$state.go("walkthrough");
			}
		});
	};
})
// APP
.controller('AppCtrl', ['$scope','$http','$ionicLoading','$location' ,'userdet','updateskills','$ionicSideMenuDelegate','$rootScope','$state','$timeout','$ionicHistory', function($scope,$http,$ionicLoading,$location,userdet,updateskills,$ionicSideMenuDelegate,$rootScope,$state,$timeout,$ionicHistory) {
	$ionicLoading.show({
		template: 'Loading...'
	});
	var resuprofile = updateskills.resultupdateskills();
	userdet.list(function(userdet) {
		console.log(userdet);
		$scope.userdet = userdet[0];
		$ionicLoading.hide();
	  });
	  $http.get("http://www.resumeon.com/pavitresumeonapp/services/getskills.php?mode=skills&deviceid="+deviceid).success(function (response)  {
           		
           		var nu = response.replace(/,/g, ", #") 
           		$scope.preferskills = "#"+nu;
        		var newarr = response.split(",");
       			
       			$scope.Myskills = newarr;
       			console.log($scope.Myskills);		   		
   });
	
	
	$scope.checkval = function(ev)
	{
		if((ev.which)=='188')
		{
			var str = document.getElementById("entry1").value;
			var df = str.slice(0,-1);
			$scope.addmyskill(df);
			this.id_entry = null;
		}
		
	};
	$scope.skillssubmit=function() {
		var df = this.id_entry;
		$scope.addmyskill(df);
		this.id_entry = null;
		
	};
	$scope.addmyskill = function (skill) {
		alert(skill);
   };

   $scope.removeskill = function (index) {
	   $scope.Myskills.splice(index, 1);
   };
	
	$scope.logout = function() {
		deviceid=$rootScope.uuid;	
		$http.post("http://www.resumeon.com/pavitresumeonapp/services/logout.php?deviceid="+deviceid).success(function(response) {
			console.log("logout"+response);
			if(response!='')
			{	
				$ionicHistory.clearCache();
				$ionicHistory.clearHistory();
				$state.go("startup");
			}
		});
	};
	
}])

// WALKTHROUGH
.controller('WalkthroughCtrl', function($scope, $cordovaFacebook, $cordovaGooglePlus, $ionicLoading,  $location, $http,$timeout,$state,$rootScope) {
	
	$timeout( function(){ $scope.callAtTimeout(); }, 1000);
	$scope.callAtTimeout=function()
	{
		deviceid=$rootScope.uuid;
		alert(deviceid);
	}
	$scope.fbLogin = function() {
		
		$cordovaFacebook.login(["public_profile", "email", "user_friends"]).then(function(success) {
    	$cordovaFacebook.api("me?fields=id,name,picture,email,gender", [])
    	.then(function(result){

    		var imagesrc = "https://graph.facebook.com/"+result.id+"/picture?type=normal";
			$http.post("http://www.resumeon.com/pavitresumeonapp/services/userreq.php?devicename=android&deviceid="+deviceid+"&name="+result.name+"&email="+result.email+"&uimg="+imagesrc+"&uid="+result.id+"&gender="+result.gender).success(function(response) {
				if(response=="1")
				{
					$state.go(app.tinder-cards);
				}
			});
			alert(result.id+result.name+result.picture.data.url+result.email+result.gender);
				
    	}, function(error) {
    		alert("Network problem.\nTry again.");
    	})
      
    }, function (error) {
    alert("Network problem.\nTry again.");
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
			
			alert(data.userId+data.displayName+data.imageUrl+data.email+data.gender)
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
.controller('TinderCardsCtrl', ['$scope','$rootScope','$timeout','$ionicLoading','$stateParams','$state' ,'$http','JobDetService','$window','$sce','$ionicSideMenuDelegate', function($scope,$rootScope,$timeout, $ionicLoading,$stateParams,$state,$http,JobDetService,$window,$sce,$ionicSideMenuDelegate) {
	
	$scope.$on('$ionicView.enter', function(){
      $ionicSideMenuDelegate.canDragContent(false);
    });
	var flagval = $stateParams.Flag;
	$scope.cards = [];
	$ionicLoading.show({
		template: 'Loading...'
	});
	
	$scope.openGeo = function() {
	    console.log("da");
		window.open($sce.trustAsResourceUrl("http://google.com"), "_self"); 
	    $window.open($sce.trustAsResourceUrl("http://google.com"), "_system", "location=yes");
	}
	$timeout( function(){ $scope.callAtTimeout1(); }, 1000);
	$scope.callAtTimeout1=function()
	{
		deviceid=$rootScope.uuid;
		$http.get("http://www.resumeon.com/pavitresumeonapp/services/getskills.php?mode=skills&deviceid="+deviceid).success(function (response)  {
			if(response=="")
			{
				$state.go('app.tinder-cards');
			}      				   		
		});
	}
	$timeout( function(){ $scope.callAtTimeout(); }, 1000);
	$scope.callAtTimeout=function()
	{
		deviceid=$rootScope.uuid;
		var responsePromise = $http.post("http://www.resumeon.com/pavitresumeonapp/services/getjobs.php?deviceid="+deviceid).then(function(response) {
			console.log(response.data);		
			$scope.pavcards = response.data;
			var lastrec = response.data[9].jobId;
			$ionicLoading.hide();
		});
	}
	
	$scope.cardDestroyed = function(index,card) {
		$scope.pavcards.splice(index, 1);
		console.log(card.jobId);
		ga('send','event','SuggestedJob','Swipe','Destroyed');
	};
	
	$scope.transitionOut = function(card) {
		console.log('card transition out');
	};
	$scope.transitionBookmark = function(index,card)
	{
		deviceid=$rootScope.uuid;
		$scope.pavcards.splice(index, 1);
		console.log('card removed to the right');
		console.log(card);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobbookmark.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				$scope.addCards(card.jobId);
			}
			
		});
	};
	$scope.transitionRight = function(card) {
		deviceid=$rootScope.uuid;
		ga('send', 'event', 'SuggestedJob', 'Swipe', 'right');
		console.log('card removed to the right');
		console.log(card);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobaccept.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				$scope.addCards(card.jobId);
			}
			
		});
	};
	
	$scope.transitionLeft = function(card) {
		deviceid=$rootScope.uuid;
		ga('send', 'event', 'SuggestedJob', 'Swipe', 'left');
		console.log('card removed to the left');
		console.log(card);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobreject.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				$scope.addCards(card.jobId);
			}
			
		});
	};
	$scope.transitionmRight = function(index,card) {
		deviceid=$rootScope.uuid;
		ga('send', 'event', 'SuggestedJob', 'Swipe', 'right');
		$scope.pavcards.splice(index, 1);
		console.log('card removed to the right');
		console.log(card);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobaccept.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				$scope.addCards(card.jobId);
			}
			
		});
	}	;

	$scope.transitionmLeft = function(index,card) {
		deviceid=$rootScope.uuid;
		ga('send', 'event', 'SuggestedJob', 'Swipe', 'left');
		$scope.pavcards.splice(index, 1);
		console.log('card removed to the left');
		console.log(card);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobreject.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				$scope.addCards(card.jobId);
			}
			
		});
	};
	$scope.onTap = function(index,card)
	{
		ga('send', 'event', 'SuggestedJob', 'Ontap', 'viewjob');
		JobDetService.setJobDet(card);
		$state.go('app.jobdispapply', {postId: card.jobId});
	};
	$scope.addCards = function(id) {
		
		var lastid = document.getElementById('lastrec').value;
		console.log("http://www.resumeon.com/pavitresumeonapp/services/getnextjob.php?lastid=" + lastid + "&destroyid=" + id);
		var responsePromise = $http.get(
				"../cellgell/services/getnextjob.php?lastid=" + lastid
						+ "&destroyid=" + id).then(
				function(response1) {
					var s = response1.data[0];
					console.log(s);
					document.getElementById('lastrec').value=s["jobId"];
					$scope.pavcards.push({
						"jobId" : s["jobId"],
						"jobTitle" : s["jobTitle"],
						"jobLocation" : s["jobLocation"],
						"skillsShort" : s["skillsShort"],
						"jobExp" : s["jobExp"],
						"jobDate" : s["jobDate"]
					});
					console.log($scope.pavcards);
				});

	};
	
	
	
}])
// PROFILE
.controller('ProfileCtrl', ['$scope','$http','$ionicLoading','userdet','updateskills','$state','$ionicPopup','$ionicModal','$timeout','$rootScope', function($scope,$http,$ionicLoading,userdet,updateskills,$state,$ionicPopup,$ionicModal,$timeout,$rootScope) {
	$scope.exp ="0";
	$scope.expmon = "0";
	$scope.data = {};

	$ionicLoading.show({
		template: 'Loading...'
	});

	$http.post("http://www.resumeon.com/pavitresumeonapp/services/getlocation.php?mode=getloc&deviceid="+deviceid).success(function (response)  {
   		var nu = response.replace(/,/g, ", #");
   		console.log("tet"+response); 
   		$scope.preferlocation = "#"+nu;
   });
   console.log("http://www.resumeon.com/pavitresumeonapp/services/getuserjbcount.php?deviceid="+deviceid);
   $http.post("http://www.resumeon.com/pavitresumeonapp/services/getuserjbcount.php?deviceid="+deviceid).success(function (response)  {
   		console.log(response);
		var countjb = response;
		var splitcnt = countjb.split("-"); 
   		$scope.countjobsapplied = splitcnt['1'];
		$scope.countfavouritejobs = splitcnt['0'];
   		$scope.countjobsinvitation = splitcnt['2'];
   });
   
   $http.get("http://www.resumeon.com/pavitresumeonapp/services/myprofile.php?deviceid="+deviceid).success(function (response)  {
		res=response;
		var myexp = response[0].exp;
		if (myexp == '0') 
		{
			var exprs = "Fresher";
		} 
		else if (myexp == '16') 
		{
			var exprs = "";
		}
		
		$scope.exp = response[0].exp;
		$scope.expmon = response[0].expmonth;
		
		$scope.imageurl = response[0].userimage;
		$scope.fromuser = response[0].fromuser;
		$scope.user_nicename = response[0].user_nicename;
		$scope.user_email = response[0].user_email;
		$scope.data.name =response[0].user_nicename;
	
		$ionicLoading.hide();
	});	
   $http.get("http://www.resumeon.com/pavitresumeonapp/services/getskills.php?mode=skills&deviceid="+deviceid).success(function (response)  {
           		
           		var nu = response.replace(/,/g, ", #") 
           		$scope.preferskills = "#"+nu;
        		var newarr = response.split(",");
       			
       			$scope.Myskills = newarr;
       			console.log($scope.Myskills);		   		
   });
   $http.get("http://www.resumeon.com/pavitresumeonapp/services/locationservice.php?deviceid="+deviceid).success(function (response)  {
       	$scope.Location = response;
       });



	/*----------------------------------------------------------------------------*/
   $scope.myupdateprofile = function()
   {
		$http.get("http://www.resumeon.com/pavitresumeonapp/services/getskills.php?mode=skills&deviceid="+deviceid).success(function (response)  {
			if(response!='')
			{
			   	$state.go("app.tinder-cards");
			}
			else
			{
				var alertPopup = $ionicPopup.alert({
			      title: 'Error!',
			      template: 'Update skills, location & experience to continue'
			    });
			
			}
		});
   };
   $scope.gotofavouritejobs= function(){
	$state.go("app.saveforlater");
   };
   $scope.gotoappliedjobs= function(){
	$state.go("app.appliedjobs");
   };
   // Name modal
   $scope.showPopup = function() {
	   $scope.data = { name: $scope.user_nicename }

	   // An elaborate, custom popup
	   var myPopup = $ionicPopup.show({
		 template: '<input type="text" ng-model="data.name" >',
		 title: 'Enter Name',
		 scope: $scope,
		 buttons: [
		   {
			 text: '<b>Save</b>',
			 type: 'button-positive',
			 onTap: function(e) {
			   if (!$scope.data.name) {
				 alert("Enter name");
				 e.preventDefault();
			   } else {
				 return $scope.data;
			   }
			 }
		   },
		 ]
	   });
	   myPopup.then(function(res) {
			 $ionicLoading.show({
			template: 'Loading...'
		});
			 $scope.user_nicename = res.name;
			 $http.get("http://www.resumeon.com/pavitresumeonapp/services/updatesprofile.php?name="+$scope.user_nicename+"&email="+$scope.user_email).success(function (response)  {
				if(response=='1')
				{
				$ionicLoading.hide();
				}
			 });
			 $ionicLoading.hide();
		});
   };
   
  // close name popup modal
	 //model popup skills start
       $ionicModal.fromTemplateUrl('Skills.html', function (modal) {
           $scope.skillModal = modal;
       }, {
           scope: $scope,
           animation: 'slide-in-left',
           focusFirstInput: true
       });
       $scope.openskillmodel = function () {
           $scope.skillModal.show();
       };

       $scope.closeskillmodel = function () {
           $scope.skillModal.hide();
       };
       //model popup skills end

       // Skill code start

       

       $scope.addmyskill = function (skill) {
		   console.log($scope.Myskills);console.log(skill);
           if ((skill.length > 1) && (skill!=' ')) {
               var isexist = false;
               var keepgoing = true;
               angular.forEach($scope.Myskills, function (item) {
                   if (keepgoing) {
                       if (item == skill) {
                           isexist = true;
                           keepgoing = false;
                       }
                       else {
                           isexist = false;
                       }
                   }
               });
               if (isexist == false) {
                   $scope.Myskills.push(skill);
               }
           }
       };

       $scope.removeskill = function (index) {
           $scope.Myskills.splice(index, 1);
       };

       // skill code end
	//model popup exp start
       $ionicModal.fromTemplateUrl('Experience.html', function (modal) {
           $scope.expModal = modal;
       }, {
           scope: $scope,
           animation: 'slide-in-left'
       });
       $scope.openexpmodel = function () {
           $scope.expModal.show();
       };

       $scope.closeexpmodel = function () {
           $scope.expModal.hide();
       };
       //model popup exp end
	 //model popup location start
       $ionicModal.fromTemplateUrl('Location.html', function (modal) {
           $scope.locModal = modal;
       }, {
           scope: $scope,
           animation: 'slide-in-left',
           focusFirstInput: true
       });
       $scope.openlocmodel = function () {
           $scope.locModal.show();
       };

       $scope.closelocmodel = function () {
           $scope.locModal.hide();
       };
       $scope.saveexp= function(year,month)
       {
    	   $ionicLoading.show({
    			template: 'updating...'
    		});
       		$http.get("http://www.resumeon.com/pavitresumeonapp/services/updateexp.php?exp="+year+"&expmonth="+month+"&deviceid="+deviceid).success(function (response)  {
	       		if(response=='1')
	       		{
		       		$scope.exp = year;
		       		$scope.expmon = month;
		       		$ionicLoading.hide();
	       		}
       		});
       		$scope.expModal.hide();
		    
       		
       };
       //model popup lacation end
       
       
      
       $scope.saveskill = function () {
           var skill = "";
           angular.forEach($scope.Myskills, function (item) {
               if (skill == "") {
                   skill = item;
               }
               else {
                   skill = skill + "," + item;
               }
           });
           $ionicLoading.show({
       		template: 'updating...'
       	});
			$http.get("http://www.resumeon.com/pavitresumeonapp/services/getskills.php?skills="+skill+"&deviceid="+deviceid).success(function (response)  {
           		var nu = response.replace(/,/g, ", #") 
           		$scope.preferskills = "#"+nu;
           		 $ionicLoading.hide();
           });
            $scope.skillModal.hide();
           
       }
        $scope.addlocation = function (loc,index) {
           console.log(loc);
           var keepgoing = true;
           var exist = true;

           if (loc.checked == true) {
               loc.checked = false;
           }
           else {
               loc.checked = true;
           }          
       }
		$scope.savelocation = function () {
           var location = "";
           angular.forEach($scope.Location, function (item) {
               if (item.checked == true) {
                   if (location == "") {
                       location = item.id;
                       console.log("lal"+location);
                   }
                   else {
                       location = location + "," + item.id;
                       console.log("pav"+location);
                   }
               }

           });
           console.log("http://www.resumeon.com/pavitresumeonapp/services/getlocation.php?preferredlocation="+location+"&deviceid="+deviceid);
           $ionicLoading.show({
	       		template: 'updating...'
	       	});
           $http.get("http://www.resumeon.com/pavitresumeonapp/services/getlocation.php?preferredlocation="+location+"&deviceid="+deviceid).success(function (response)  {
           		var nu = response.replace(/,/g, ", #") 
           		$scope.preferlocation = "#"+nu;
           		console.log($scope.preferlocation);
           });
           $scope.locModal.hide();
           $ionicLoading.hide();
       }
       
      
	
	$ionicModal.fromTemplateUrl('sendemail.html', function (modal) {
           $scope.taskModal = modal;
       }, {
           scope: $scope,
           animation: 'slide-in-left'
       });
	   /*function send mail popup*/	
       $scope.Sendmailpop = function () {
         
           $scope.taskModal.show();
       };
	   /*function send mail popup*/
	   $scope.closeSendmailpop = function () {
		   $scope.taskModal.hide();
	   };
	/*function add experience*/
	$scope.popupaddexp = function()
	{
		   	
		   $scope.data = {}
		
		   // An elaborate, custom popup
		   var myPopup = $ionicPopup.show({
		     template: '<select style="width:100%"  ng-model="data.experience"><option value="0">Fresher</option><option value="1">1 year</option><option value="2">2 years</option><option value="3">3 years</option><option value="4">4 years</option><option value="5">5 years</option><option value="6">6 years</option><option value="7">7 years</option><option value="8">8 years</option><option value="9">9 years</option><option value="10">10 years</option><option value="11">11 years</option><option value="12">12 years</option><option value="13">13 years</option><option value="14">14 years</option><option value="15">15 years</option><option value="16">15+ years</option></select>',
		     title: 'Update Experience',
		     scope: $scope,
		     buttons: [
		       {
		         text: 'Save',
		         type: 'button-positive',
		         onTap: function(e) {
		           if (!$scope.data.experience) {
		             //don't allow the user to close unless he enters wifi password
		             e.preventDefault();
		           } 
		           else 
		           {
		           	 var experi = $scope.data.experience;
		           	 $http.post("http://www.resumeon.com/pavitresumeonapp/services/updateprofile.php?mode=profile&field=exp&exp="+experi).success(function(response) {
		           	 	if(response=='1')
		           	 	{
		           	 		if(experi=="0")
		           	 		{
		           	 			document.getElementById("userexp").innerHTML = "Fresher";
		           	 		}
		           	 		else if(experi=="16")
		           	 		{
		           	 			document.getElementById("userexp").innerHTML = "15+ yrs";
		           	 		}
		           	 		else if(experi=="1")
		           	 		{
		           	 			document.getElementById("userexp").innerHTML = "1 year";
		           	 		}
		           	 		else
		           	 		{
			           	 		document.getElementById("userexp").innerHTML = experi+" yrs";
		           	 		}
		           	 	}
		           	 });
		           	 return $scope.data.experience;
		           }
		         }
		       },
		        { text: 'Cancel' },
		     ]
		   });
		   myPopup.then(function(res) {
		     console.log('Tapped!', res);
		   });
		   
		  
		   
	};
	/*function location popup*/
	$scope.popupaddlocation = function()
	{
		   	
		   $scope.data = {}
		
		   // An elaborate, custom popup
		   var myPopup = $ionicPopup.show({
		     template: '<select style="width:100%"  ng-model="data.location"><option value="Delhi">Delhi</option><option value="Gurgaon">Gurgaon</option></select>',
		     title: 'Update Preferred Location',
		     scope: $scope,
		     buttons: [
		       {
		         text: 'Save',
		         type: 'button-positive',
		         onTap: function(e) {
		           if (!$scope.data.location) {
		             //don't allow the user to close unless he enters wifi password
		             e.preventDefault();
		           } 
		           else 
		           {
		           	 var location = $scope.data.location;
		           	 $http.post("http://www.resumeon.com/pavitresumeonapp/services/updateprofile.php?mode=profile&field=location&location="+location).success(function(response) {
		           	 	if(response=='1')
		           	 	{
		           	 		document.getElementById("preferredlocation").innerHTML=location;
		           	 	}
		           	 });
		           	 return $scope.data.location;
		           }
		         }
		       },
		        { text: 'Cancel' },
		     ]
		   });
		   myPopup.then(function(res) {
		     console.log('Tapped!', res);
		   });
		   
		  
		   
	};
	/*function logout*/	
	$scope.logout = function() {
		$http.post("http://www.resumeon.com/pavitresumeonapp/services/logout.php").success(function(response) {
			console.log("logout"+response);
			if(response!='')
			{	
				//window.location.href="http://www.resumeon.com/resumeonapp/newresumeonapp/www/index.html?devicename=android&deviceid="+response;
			}
		});
	};
			
}])
.controller('SearchCtrl', ['$scope', '$ionicLoading','$ionicHistory' ,'$ionicModal','$ionicPopup','$http','$state','JobsearchService','searchres','$timeout','$rootScope', function($scope, $ionicLoading,$ionicHistory,$ionicModal,$ionicPopup,$http,$state,JobsearchService,searchres,$timeout,$rootScope) {
	
	$ionicHistory.clearHistory();
	$scope.searchcards=[];
	//model popup exp end
    $http.get("http://www.resumeon.com/pavitresumeonapp/services/getlocation.php?mode=getloc&deviceid="+deviceid).success(function (response)  {
  		var nu = response.replace(/,/g, ", #"); 
  		$scope.searchloc = response;
  		$scope.preferlocation = "#"+nu;
  		
  });
   
   $http.get("http://www.resumeon.com/pavitresumeonapp/services/getskills.php?mode=skills&deviceid="+deviceid).success(function (response)  {
	   $scope.searchskills = response;    		
	   var nu = response.replace(/,/g, ", #");
           		$scope.preferskills = "#"+nu;
        		var newarr = response.split(",");
       	$scope.Myskills = newarr;		   		
           });
	 //model popup skills start
       $ionicModal.fromTemplateUrl('Skills.html', function (modal) {
           $scope.skillModal = modal;
       }, {
           scope: $scope,
           animation: 'slide-in-left',
           focusFirstInput: true
       });
       $scope.openskillmodel = function () {
           $scope.skillModal.show();
       };

       $scope.closeskillmodel = function () {
           $scope.skillModal.hide();
       };
       //model popup skills end

       // Skill code start

       

       $scope.addmyskill = function (skill) {
          if ((skill.length > 1) && (skill!=' ')) {
               var isexist = false;
               var keepgoing = true;
               angular.forEach($scope.Myskills, function (item) {
                   if (keepgoing) {
                       if (item == skill) {
                           isexist = true;
                           keepgoing = false;
                       }
                       else {
                           isexist = false;
                       }
                   }
               });
               if (isexist == false) {
                   $scope.Myskills.push(skill);
               }
           }
       };

       $scope.removeskill = function (index) {
           $scope.Myskills.splice(index, 1);
       };

	 //model popup location start
    $ionicModal.fromTemplateUrl('Location.html', function (modal) {
        $scope.locModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-left',
        focusFirstInput: true
    });
    $scope.openlocmodel = function () {
        $scope.locModal.show();
    };

    $scope.closelocmodel = function () {
        $scope.locModal.hide();
    };
  //model popup lacation end
    
    $http.get("http://www.resumeon.com/pavitresumeonapp/services/locationservice.php?deviceid="+deviceid).success(function (response)  {
    	
    	console.log(response);
    	$scope.Location = response;
    	console.log($scope.Location);
    });
   
    $scope.saveskill = function () {
        var skill = "";
        angular.forEach($scope.Myskills, function (item) {
            if (skill == "") {
                skill = item;
            }
            else {
                skill = skill + "," + item;
            }
        });
        console.log(skill);
        var nu = skill.replace(/,/g, ", #") 
		$scope.preferskills = "#"+nu;
		$scope.searchskills = skill;
			
         $scope.skillModal.hide();
    }
		$scope.savelocation = function () {
        var location = "";
        angular.forEach($scope.Location, function (item) {
            if (item.checked == true) {
                if (location == "") {
                    location = item.id;
                }
                else {
                    location = location + "," + item.id;
                }
            }

        });
        $http.get("http://www.resumeon.com/pavitresumeonapp/services/searchlocation.php?searchlocation="+location+"&deviceid="+deviceid).success(function (response)  {
           		var nu = response.replace(/,/g, ", #") 
           		$scope.preferlocation = "#"+nu;
           		console.log($scope.preferlocation);
           		$scope.searchloc = response;
           });
        $scope.locModal.hide();
    }
    
    $scope.addlocation = function (loc) {
        var keepgoing = true;
        var exist = true;

        if (loc.checked == true) {
            loc.checked = false;
        }
        else {
            loc.checked = true;
        }          
    };
	$scope.logout = function() {
		$http.post("http://www.resumeon.com/pavitresumeonapp/services/logout.php?deviceid="+deviceid).success(function(response) {
			console.log("logout"+response);
			{	
				//window.location.href="http://www.resumeon.com/resumeonapp/newresumeonapp/www/index.html?devicename=android&deviceid="+response;
			}
		});
	};
	$scope.searchdata = function(what,where)
	{
		ga('send', 'event', 'SearchData', 'searchskillsloc', "what:"+what+"&where:"+where);
		console.log("mayi"+$scope.searchskills);
		console.log("miyu"+$scope.searchloc);
		JobsearchService.setJobsearchDet(what,where);
		console.log(what+"pav"+where);
		var resultfac = searchres.resultsearch(what,where).success(function(response){
			
			$state.go('app.searchres', { param:1 } );
		});
		
		
	};
	
		
	console.log($scope.searchcards);
	
	
}])
.controller('SearchresCtrl', ['$scope', '$ionicLoading' ,'$stateParams','searchres','$http','$state','$ionicHistory','JobsearchService','JobDetService','$timeout','$rootScope', function($scope, $ionicLoading,$stateParams,searchres,$http,$state,$ionicHistory,JobsearchService,JobDetService,$timeout,$rootScope) {
	
	
	
	var stateparam = $stateParams.param;
	var stateval = JobsearchService.getJobSearchDet();
	
	$scope.searchcards = searchres.getresdata();

	if((stateparam!='') && (stateparam!='1'))
	{
		angular.forEach($scope.searchcards, function(item) 
		{
            if (item.jobId == stateparam) 
            {
                $scope.searchcards.splice($scope.searchcards.indexOf(item), 1);
            }
        });
	}
	
	$ionicLoading.hide();
	$scope.logout = function() {
		$http.post("http://www.resumeon.com/pavitresumeonapp/services/logout.php?deviceid="+deviceid).success(function(response) {
			console.log("logout"+response);
			if(response!='')
			{	
				//window.location.href="http://www.resumeon.com/resumeonapp/newresumeonapp/www/index.html?devicename=android&deviceid="+response;
			}
		});
	};
	
	$scope.cardDestroyed = function(index,card) {
		$scope.searchcards.splice(index, 1);
		console.log(card.jobId);
	};

	$scope.transitionOut = function(card) {
		console.log('card transition out');
	};
	
	$scope.transitionBookmark = function(index,card)
	{
		$scope.searchcards.splice(index, 1);
		console.log('card removed to the right');
		console.log(card);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobbookmark.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			if(response=='1')
			{
				
			}
		});
	};
	$scope.transitionRight = function(card) {
		ga('send', 'event', 'SearchJob', 'Swipe', 'Apply');
		console.log('card removed to the right');
		console.log(card);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobaccept.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				
			}
			
		});
	};

	$scope.transitionLeft = function(card) {
		ga('send', 'event', 'SearchJob', 'Swipe', 'Reject');
		console.log('card removed to the left');
		console.log(card);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobreject.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				
			}
			
		});
	};
	$scope.transitionmRight = function(index,card) {
	ga('send','event','SearchJob','Swipe','Apply');
		$scope.searchcards.splice(index, 1);
		console.log('card removed to the right');
		console.log(card);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobaccept.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				
			}
			
		});
	};

	$scope.transitionmLeft = function(index,card) {
	ga('send','event','SearchJob','Swipe','Reject');
		$scope.searchcards.splice(index, 1);
		console.log('card removed to the left');
		console.log(card);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobreject.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				
			}
			
		});
	};
	$scope.onTap = function(index,card)
	{
		ga('send', 'event', 'SuggestedJob', 'Ontap', 'viewjob');
		JobDetService.setJobDet(card);
		$state.go('app.searchresapply', {postId: card.jobId});
	};
	
}])
//SaveForLaterCards
.controller('SaveForLaterCards', ['$scope', '$ionicLoading' ,'$http','JobDetService','$state','$stateParams','$timeout','$rootScope', function($scope, $ionicLoading,$http,JobDetService,$state,$stateParams,$timeout,$rootScope) {
	
	var jobbackid = $stateParams.jobid;
	
	$scope.cards = [];
	$scope.SaveForLaterCards = [];
	$ionicLoading.show({
		template: 'Loading...'
	});
	
	console.log("http://www.resumeon.com/pavitresumeonapp/services/saveforlater.php?deviceid="+deviceid);
	$http.post("http://www.resumeon.com/pavitresumeonapp/services/saveforlater.php?deviceid="+deviceid).then(function(response) {
		if (response.data === "null")
		{
			console.log("a"+response);
		}
		else
		{ 
			$scope.SaveForLaterCards = response.data;
			if(jobbackid!='')
			{
				angular.forEach($scope.SaveForLaterCards, function(item) 
				{
			        if (item.jobId == jobbackid) 
		            {
		                $scope.SaveForLaterCards.splice($scope.SaveForLaterCards.indexOf(item), 1);
		            }
		        });
			}
		}
		$ionicLoading.hide();
	});
	
	$scope.logout = function() {
		$http.post("http://www.resumeon.com/pavitresumeonapp/services/logout.php?deviceid="+deviceid).success(function(response) {
			console.log("logout"+response);
			if(response!='')
			{	
				//window.location.href="http://www.resumeon.com/resumeonapp/newresumeonapp/www/index.html?devicename=android&deviceid="+response;
			}
		});
	};
	$scope.cardDestroyed = function(index,card) {
		$scope.SaveForLaterCards.splice(index, 1);
		console.log(card.jobId);
	};
	
	$scope.transitionOut = function(card) {
		console.log('card transition out');
	};
	$scope.transitionBookmark = function(index,card)
	{
		$scope.SaveForLaterCards.splice(index, 1);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobbookmark.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				
			}
			
		});
	};
	$scope.transitionRight = function(card) {
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobaccept.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				
			}
			
		});
	};

	$scope.transitionLeft = function(card) {
		
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobreject.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				
			}
			
		});
	};
	$scope.transitionmRight = function(index,card) {
		$scope.SaveForLaterCards.splice(index, 1);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobaccept.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				
			}
			
		});
	};

	$scope.transitionmLeft = function(index,card) {
		$scope.SaveForLaterCards.splice(index, 1);
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobreject.php?jobid="+card.jobId+"&deviceid="+deviceid).success(function(response) {
			console.log(response);
			if(response=='1')
			{
				
			}
			
		});
	};
	$scope.onTap = function(index,card)
	{
		JobDetService.setJobDet(card);
		$state.go('app.shortlistapply', {postId: card.jobId});
	};
	
	
}])
.controller('JobdispapplyPostCtrl', ['$scope', '$http', '$stateParams', 'PostService', 'JobDetService', '$ionicLoading','$cordovaSocialSharing','$state','$ionicHistory','$ionicPopup','$timeout','$rootScope','$cordovaSocialSharing', function($scope, $http, $stateParams, PostService, JobDetService, $ionicLoading,$cordovaSocialSharing,$state,$ionicHistory,$timeout,$ionicPopup,$cordovaSocialSharing) {
	var postId = $stateParams.postId;
	console.log(JobDetService.getJobDet());
	$scope.jobdetails = JobDetService.getJobDet();
	
	$scope.ontap = function()
	{
		$state.go('app.tinder-cards', {Flag: 1});
	}
	$scope.share = function () {
		$cordovaSocialSharing.share('This is my message', 'Subject string', null, 'http://www.mylink.com');
	}
	$scope.share = function(jobid)
	{
		var alertPopup = $ionicPopup.show({
	        scope: $scope,
	        title: 'Share',
	        template: '<b><a href="mailto:someone@example.com?Subject=Hello%20again"><i class="ion-android-mail"></i> Email</a></b>'
	    });
		
	};
	$scope.logout = function() {
		$http.post("http://www.resumeon.com/pavitresumeonapp/services/logout.php?deviceid="+deviceid).success(function(response) {
			console.log("logout"+response);
			if(response!='')
			{	
				//window.location.href="http://www.resumeon.com/resumeonapp/newresumeonapp/www/index.html?devicename=android&deviceid="+response;
			}
		});
	};
	$scope.jobapply=function(jobid)
	{	
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobaccept.php?jobid="+jobid+"&deviceid="+deviceid).success(function(response) {
			console.log("apply"+response);
			if(response=='1')
			{
				console.log("apply");
				$scope.ontap();
			}
		});
	};
	$scope.jobshortlist=function(jobid)
	{
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobbookmark.php?jobid="+jobid+"&deviceid="+deviceid).success(function(response) {
			console.log("apply"+response);
			if(response=='1')
			{
				console.log("apply");
				$scope.ontap();
			}
		});
	};
	$scope.jobignore=function(jobid)
	{
		var job_delrec = $http.get("http://www.resumeon.com/pavitresumeonapp/services/jobreject.php?jobid="+jobid+"&deviceid="+deviceid).success(function(response) {
			console.log("apply"+response);
			if(response=='1')
			{
				console.log("ignore");
				$scope.ontap();
			}
		});
	};
	
}])
// WORDPRESS
.controller('WordpressCtrl', ['$scope', '$http', '$ionicLoading', 'PostService', 'BookMarkService', function($scope, $http, $ionicLoading, PostService, BookMarkService) {
	$scope.posts = [];
	$scope.page = 1;
	$scope.totalPages = 1;

	$scope.doRefresh = function() {
		$ionicLoading.show({
			template: 'Loading posts...'
		});

		//Always bring me the latest posts => page=1
		PostService.getRecentPosts(1)
		.then(function(data){
			ga('send', 'event', 'Blog', 'resumeonblog', 'recentblog');
			$scope.totalPages = data.pages;
			$scope.posts = PostService.shortenPosts(data.posts);

			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	
	$scope.logout = function() {
		$http.post("http://www.resumeon.com/pavitresumeonapp/services/logout.php").success(function(response) {
			console.log("logout"+response);
			if(response!='')
			{	
			}
		});
	};

	$scope.loadMoreData = function(){
		ga('send', 'event', 'Blog', 'resumeonblog', 'moreblogs');
		$scope.page += 1;

		PostService.getRecentPosts($scope.page)
		.then(function(data){
			//We will update this value in every request because new posts can be created
			$scope.totalPages = data.pages;
			var new_posts = PostService.shortenPosts(data.posts);
			$scope.posts = $scope.posts.concat(new_posts);

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	$scope.moreDataCanBeLoaded = function(){
		return $scope.totalPages > $scope.page;
	};

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkWordpressPost(post);
	};

	$scope.doRefresh();
}])

// WORDPRESS POST
.controller('WordpressPostCtrl', ['$scope', '$http', '$stateParams', 'PostService', 'JobDetService','$cordovaSocialSharing', '$ionicLoading', function($scope, $http, $stateParams, PostService, JobDetService,$cordovaSocialSharing, $ionicLoading) {

$ionicLoading.show({
		template: 'Loading post...'
	});

	var postId = $stateParams.postId;
	PostService.getPost(postId)
	.then(function(data){
	ga('send', 'event', 'Blog', 'resumeonblog', 'readpost');
		$scope.post = data.post;
		$ionicLoading.hide();
	});

	$scope.sharePost = function(link){
		window.plugins.socialsharing.share('Check this post here: ', null, null, link);
	};
	var postId = $stateParams.postId;
	console.log(JobDetService.getJobDet());
	$scope.jobdetails = JobDetService.getJobDet();

	var postId = $stateParams.postId;
	console.log(JobDetService.getJobDet());
	$scope.jobdetails = JobDetService.getJobDet();
	
}])
//Applied Jobs
.controller('AppliedJobs', ['$scope','$http','$ionicLoading','$state','JobDetService','$timeout','$rootScope', function($scope,$http,$ionicLoading,$state,JobDetService,$timeout,$rootScope) {
	
	$ionicLoading.show({
		template: 'Loading...'
	});
	console.log("applied job");
	$scope.appcnt="0";
	
	var responsePromise = $http.get("http://www.resumeon.com/pavitresumeonapp/services/appliedjobs.php?deviceid="+deviceid).then(function(response) 
	{			
	
				if (response.data === "null")
				{
					console.log(response);
				}
				else
				{ 
				$scope.appliedjobs = response.data;
				$scope.appcnt = $scope.appliedjobs.length;
				console.log($scope.appcnt);
				}
				$ionicLoading.hide();
	});
	$scope.doRefresh = function()
	{
		$http.get("http://www.resumeon.com/pavitresumeonapp/services/appliedjobs.php?deviceid="+deviceid).then(function(response) 
		{			
					if (response.data === "null")
					{
						console.log(response);
					}
					else
					{ 
					$scope.appliedjobs = response.data;
					$scope.appcnt = $scope.appliedjobs.length;
					console.log($scope.appcnt);
					}
		});
						$scope.$broadcast('scroll.refreshComplete');
	};
	$scope.onHold = function($index,card)
	{
		JobDetService.setJobDet(card);
		$state.go('app.viewlistapply', {postId: card.jobId});
	};
	
}])
;

tpapp.factory('userdet',['$http','$rootScope', function($http,$rootScope) {
	deviceid=$rootScope.uuid;
	return {
        list: function(callback){
          $http.get('http://www.resumeon.com/pavitresumeonapp/services/getuserdetails.php?deviceid='+deviceid).success(callback);
        }
      };
      
    
    
}]);
tpapp.factory('searchres',['$http','$rootScope', function($http,$rootScope) {
	var res=[];
	return {
		resultsearch: function(what,where){
        	console.log(what+"res"+where);
        	ga('send','event','Search','Swipe','Apply');
        	return $http.get("http://www.resumeon.com/pavitresumeonapp/services/getjobsbyskills.php?what="+what+"&where="+where).success(function (response)  {
        		console.log("k"+response[0].jobTitle);
        		console.log(response);
        		res=response;
        		return res;
        	});
        },
        getresdata : function() 
        {
        	return res;
        }
      };
    
}]);
tpapp.factory('mainjobsearch',['$http','$rootScope', function($http,$rootScope) {
	var mainres=[];
	deviceid=$rootScope.uuid;
	return {
		resultsearch: function(what,where){
        	console.log(what+"mainres"+where);
        	
        	return $http.get("http://www.resumeon.com/pavitresumeonapp/services/getjobs.php").success(function (response)  {
        		console.log("par"+response[0].jobTitle);
        		mainres=response;
        		return mainres;
        	});
        },
        getresdata : function() 
        {
        	return mainres;
        }
      };
    
}]);
tpapp.factory('updateskills',['$http','$rootScope', function($http, $rootScope) {
	var res=[];
	deviceid=$rootScope.uuid;
	return {
	resultupdateskills: function() {
		console.log("http://www.resumeon.com/pavitresumeonapp/services/myprofile.php?deviceid="+deviceid);
		return $http.get("http://www.resumeon.com/pavitresumeonapp/services/myprofile.php?deviceid="+deviceid).success(function (response)  {
			res=response;
			console.log(response);
			return res;
		});
	},
	updateskill:function(skill)
	{
		console.log(res);
		res[0].skills =  skill;
		console.log(res);
	},
	
	getupdateskillsdata:function() 
	{
		console.log("fight"+res);
		return res;
	
	}
  };    
}]);






