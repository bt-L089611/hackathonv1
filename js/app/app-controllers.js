'use strict'
var wealthControllers = angular.module( 'wealthControllers', [
    'wealthDataServices', 'wealthServices', 'wealthConstants','wealthDirectieves'
] );
wealthControllers.controller( 'wpAppController', wpAppController );
wealthControllers.controller( 'overviewController', overviewController );
wealthControllers.controller( 'modalController', modalController );
wealthControllers.controller( 'footerController', footerController );
wealthControllers.controller( 'superController', superController );

wpAppController.$inject = [
    '$scope', '$rootScope', '$state', '$location', '$window', '$timeout', 'wpDataService', 'wpUtilService', 'appconfig'
];
function wpAppController ( $scope, $rootScope, $state, $location, $window, $timeout, wpDataService, wpUtilService, appconfig ) {
    var self = this;
	$rootScope.stateIsLoading = false;
	self.ideas = [
    ['My Bank Balance', 70000],
    ['My super', 20000],
    ['Insurance', 5000],
	['Term deposit', 2000],
	['Loan', 50000]
  ];
  wpDataService.getDataService('home.json').then( function ( data ) {
	$rootScope.questions = data;
  });

}

modalController.$inject = [
    '$scope', '$rootScope', 'wpDataService', 'wpUtilService', '$window', '$location', '$timeout', '$state', 'appconfig'
];

function modalController ( $scope, $rootScope, wpDataService, wpUtilService, $window, $location, $timeout, $state, appconfig ) {

}

overviewController.$inject = [
    '$scope', '$rootScope', 'wpDataService', 'wpUtilService', '$window', '$location', '$timeout', '$state', 'appconfig'
];
function overviewController ( $scope, $rootScope, wpDataService, wpUtilService, $window, $location, $timeout, $state, appconfig ) {
    

}

superController.$inject = [
    '$scope', '$rootScope', 'wpDataService', 'wpUtilService', '$window', '$location', '$timeout', '$state', 'appconfig'
];

function superController ( $scope, $rootScope, wpDataService, wpUtilService, $window, $location, $timeout, $state, appconfig ) {
	
	var self = this;
	wpDataService.getDataService('super.json').then( function ( data ) {
		$rootScope.questions = data;
		console.log($rootScope.questions);
  	});
}

footerController.$inject = [
    '$scope', '$rootScope', 'wpDataService', 'wpUtilService', '$window', '$location', '$timeout', '$state', 'appconfig'
];
function footerController ( $scope, $rootScope, wpDataService, wpUtilService, $window, $location, $timeout, $state, appconfig ) {
    var self = this;
    $scope.user_speech = true;
    $scope.usertalktext = "";
    $scope.useraction = function () {
    	console.log($scope.user_speech);
    	
	if(!$scope.user_speech) {
		speechRs.rec_stop();
		
		var target = wpUtilService.matcher($scope.usertalktext, $rootScope.questions.questions[$rootScope.converstaionIndex].answers);
		console.log(target);
		var scenario = undefined;
		if(target != undefined && target.length > 0) {
			scenario = $rootScope.questions.questions[$rootScope.converstaionIndex].positive;
		} else {
			scenario = $rootScope.questions.questions[$rootScope.converstaionIndex].negative;
		}
		
		if(scenario != undefined) {
			if(scenario.action == 'question') {
				$rootScope.converstaionIndex = scenario.index;
				jarvisQ($rootScope.converstaionIndex);
				$scope.user_speech = !$scope.user_speech;
			}
			if(scenario.action == 'redirect') {
				$rootScope.converstaionIndex = scenario.index;
				$state.go(scenario.url);
			}
			if(scenario.action == 'end') {
				console.log('End of converstaion');
			}
		}
	}
    	
    };
    
    var jarvisQ = function (index) {
    	speechRs.speechinit('Google UK English Female',function(e){
	        speechRs.speak($rootScope.questions.questions[index].voice, function() {
	        	$scope.user_speech = false;
	        	$scope.$apply();
	        	speechRs.rec_start('en-IN',function(final_transcript,interim_transcript){
			 	$scope.usertalktext = final_transcript + interim_transcript;
	    		});
	    		
	    		
		}, false);
        });
    };
    jarvisQ($rootScope.converstaionIndex);
}
