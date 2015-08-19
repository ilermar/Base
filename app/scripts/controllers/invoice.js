'use strict';

/**
 * @ngdoc function
 * @name baseApp.controller:InvoiceCtrl
 * @description
 * # InvoiceCtrl
 * Controller of the baseApp
 */
angular.module('baseApp')
  .controller('InvoiceCtrl', [ '$rootScope', '$scope', '$http', '$location', 'Auth', 'dialogs', '$translate', '$routeParams', 
  	function ( $rootScope, $scope, $http, $location, Auth, dialogs, $translate, $routeParams ) {

  		$translate.use( 'es' );
  		$scope.invoice = {};
  		$scope.validInvoice = false;

	    $scope.loadDashboard = function(){
	    	if( $routeParams.idInvoice ){
	    		
		    	$http.get( 'api/invoice.json?rnd=' + Math.random(), {
						params:{
							id:$routeParams.idInvoice,
							token:$rootScope.currentUser.token
						} 
					} ).then(
			        	function(response) {
			            	if(response.status === 200){
			        			response = response.data;
								if( response.rc === "00" ){
									$scope.validInvoice = true;
									$scope.invoice = response.data;
								}else if( response.rc === "01" ){ /// Sesión inválida
						        	$rootScope.currentUser = null;
							      	Auth.setUser($rootScope.currentUser);
							      	$location.path('/login');
						        }else{
						        	$scope.invoice = {};
						        	dialogs.error('Error al obtener facturas', response.rm );
						        }
			            	}else{
			              		$scope.invoice = {};
			              		dialogs.error('Error de comunicación', "Imposible obtener las facturas" );
			            	}
			        	}, function() {
			        		$scope.invoice = {};
			        		dialogs.error('Error de comunicación', "Imposible obtener las facturas" );
						}
					);


	    	}else{
	    		var dlg = dialogs.error( 'Factura inválida', 'No se encontró el identificador de la factura.' );
	    		dlg.result.then(function(){
		        	$location.path('/invoices');
		        },function(){
		        	$location.path('/invoices');	
		        });
	    	}
	    };

	    $scope.loadDashboard();

 } ] );