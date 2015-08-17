'use strict';

/**
 * @ngdoc function
 * @name baseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the baseApp
 */
angular.module('baseApp')
  .controller('MainCtrl', [ '$rootScope', '$scope', '$http', '$location', 'Auth', 'dialogs', '$translate',
  	function ( $rootScope, $scope, $http, $location, Auth, dialogs, $translate ) {
  		$scope.isCollapsed 	= true;
  		$scope.companies 	= [];
  		$scope.business 	= [];
  		$scope.currencies 	= [];
  		$scope.statuss 		= [];

		$translate.use( 'es' );
  		$scope.myCarousel = {
  			interval : 2000,
  			noWrapSlides : false,
  			slides : [
	  			{
	  				"image":"images/slider_1.jpg",
	  				"text":""
	  			},
	  			{
	  				"image":"images/slider_2.jpg",
	  				"text":""
	  			},
	  			{
	  				"image":"images/slider_3.jpg",
	  				"text":""
	  			},
	  			{
	  				"image":"images/slider_4.jpg",
	  				"text":""
	  			}
	  		]
	  	};

	    $rootScope.login = function () { 
	      $rootScope.currentUser = null;
	      
	      $rootScope.dataLoading = true;
	      var request = $http({
	            method: 'POST',
	            url: 'api/login.json',
	            data: {
	              'email' : $rootScope.username,
	              'password' : $rootScope.password
	            }
	      });
	      
	      request.success(function(response, status) {
	        $rootScope.dataLoading = false;
	        if( status === 200 ) {
	        	if( response.rc === "00" ){
		        	var data = response.data;
		        	$rootScope.currentUser = {
		              fullName : data.name ? data.name : 'Nombre no disponible',
		              profile : data.profile,
		              email : $rootScope.username,
		              rfc: data.rfc,
		              provider: data.provider
		            };
		            Auth.setUser($rootScope.currentUser);
		            $location.path('/main');
		        }else if( response.rc === "01" ){ /// Sesión inválida
		        	$rootScope.currentUser = null;
			      	Auth.setUser($rootScope.currentUser);
			      	$location.path('/login');
		        }else{
		        	dialogs.error('Error de inicio de sesión', response.rm );
		        }
	        }else{
	          	dialogs.error('Error de comunicación', response.rm );
	        }
	      }).error(function(msg){
	        dialogs.error('Error de comunicación', msg );
	      });
	    };

	    $rootScope.closeSession = function () {
	      $http({
	            method: 'POST',
	            url: 'api/logout.json',
	            data:{
	            //pendiente si van a querer que se envie el token	
	            }
	      });

	      $rootScope.currentUser = null;
	      Auth.setUser($rootScope.currentUser);
	      $location.path('/login');
	    };

	   	//dialogs.error('Ejemplo de dialogo', "response.rm  esto debe ser el texto" );
}]);