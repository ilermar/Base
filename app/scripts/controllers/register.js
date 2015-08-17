'use strict';

/**
 * @ngdoc function
 * @name baseApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the baseApp
 */
angular.module('baseApp')
.controller('RegisterCtrl', [ "$scope", "$http", "$location", 'dialogs', '$translate', function( $scope, $http, $location, dialogs, $translate ) {
	$scope.obj = {

	};
	$translate.use( 'es' );

	$scope.submit = function(){
		
		$http.get( 'api/register.json?rnd=' + Math.random(), {
			params:$scope.obj 
		} ).then(
        	function(response) {
        		if(response.status === 200){
            		response = response.data;
            		if( response.rc === '00' ){
            			var dlg = dialogs.notify('Usuario registrado', response.rm );    
            			dlg.result.then(function(){
				        	$location.path('/main');
				        },function(){
				        	$location.path('/main');	
				        });
            		}else{
            			dialogs.error('Error en el registro', response.rm );
            		}         	   		
            	}else{
              		dialogs.error('Error de comunicación', response.rm );
            	}
        	}, function(msg) {
        		dialogs.error('Error de comunicación', msg );
			}
		);

	};    

}]);