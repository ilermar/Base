'use strict';

/**
 * @ngdoc function
 * @name baseApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the baseApp
 */
angular.module('baseApp')
.controller('RegisterCtrl', [ "$scope", "$http", "$location", function( $scope, $http, $location ) {
	$scope.obj = {

	};

	$scope.submit = function(){
		
		$http.get( 'api/register.json?rnd=' + Math.random(), {
			params:$scope.obj 
		} ).then(
        	function(response) {
            	if(response.status === 200){
            		console.log($scope.obj);
            		//mostrar mensaje
            		$location.path('/main');
            	}else{
              		
            	}
        	}, function() {
        		//error
			}
		);

	};    

}]);