'use strict';

/**
 * @ngdoc function
 * @name baseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the baseApp
 */
angular.module('baseApp')
  .controller('MainCtrl', [ '$rootScope', '$scope', '$http', '$location', 'Auth', 'dialogs', '$translate', '$modal',
  	function ( $rootScope, $scope, $http, $location, Auth, dialogs, $translate, $modal ) {
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
		              provider: data.provider,
		              token: data.token,
		              first: data.first ? data.first : 0
		            };
		            Auth.setUser($rootScope.currentUser);
		            $location.path('/main');
		            $scope.firstLogin();
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
	            	token : $rootScope.currentUser.token
	            }
	      });

	      $rootScope.currentUser = null;
	      Auth.setUser($rootScope.currentUser);
	      $location.path('/login');
	    };

	    $scope.firstLogin = function () {
		   	if( $rootScope.currentUser && $rootScope.currentUser.first ){ //Ingresa por primera vez
		   		
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: 'myModalContent.html',
					controller: 'ModalInstanceCtrl',
					size: "lg",
					resolve: {
						items: function () {
							//ejemplo de como compartir data
							return ['item1', 'item2', 'item3'];
						}
					}
				});

				modalInstance.result.then(function (selectedItem) {
					var x = selectedItem;

					$http.get( 'api/terms.json?rnd=' + Math.random(), {
						params:{
							user : $rootScope.currentUser.username,
							token: $rootScope.currentUser.token,
							test: x
						} 
					} ).then(
			        	function(response) {
			            	if(response.status === 200){
			        			response = response.data;
								if( response.rc === "00" ){
									$rootScope.currentUser.first = false;
								}else if( response.rc === "01" ){ /// Sesión inválida
						        	$rootScope.currentUser = null;
							      	Auth.setUser($rootScope.currentUser);
							      	$location.path('/login');
						        }else{
						        	dialogs.error('Error Alta de usuario', response.rm );
						        	$rootScope.currentUser = null;
							      	Auth.setUser($rootScope.currentUser);
							      	$location.path('/login');
						        }
			            	}else{
			              		dialogs.error('Error de comunicación', "Imposible enviar infocrmación" );
			              		$rootScope.currentUser = null;
						      	Auth.setUser($rootScope.currentUser);
						      	$location.path('/login');
			            	}
			        	}, function() {
			        		dialogs.error('Error de comunicación', "Imposible enviar infocrmación" );
			        		$rootScope.currentUser = null;
					      	Auth.setUser($rootScope.currentUser);
					      	$location.path('/login');
						}
					);

				}, function () {
					$rootScope.currentUser = null;
			      	Auth.setUser($rootScope.currentUser);
			      	$location.path('/login');
				});
		   	}
		};

}])
.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {
	$scope.items = items;
	$scope.selected = {
		item: $scope.items[0]
	};

	$scope.ok = function () {
		$modalInstance.close( $scope.selected.item ); /// regresar información 
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});