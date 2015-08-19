'use strict';

/**
 * @ngdoc function
 * @name baseApp.controller:UpInvoiceCtrl
 * @description
 * # UpInvoiceCtrl
 * Controller of the baseApp
 */
angular.module('baseApp')
.controller('UpInvoiceCtrl', [ '$rootScope', '$scope', 'Upload', '$timeout', '$http', '$location', 'Auth', 'dialogs', '$translate', 
	function( $rootScope, $scope, Upload, $timeout, $http, $location, Auth, dialogs, $translate ){

	$translate.use( 'es' );
	$scope.validInvoice = false;
	$scope.invoice = {};

	$scope.uploadXML = function(file) {

		file.upload = Upload.upload({
			url: 'api/upload.json',
			method: 'POST',
			headers: {
				'my-header': 'my-header-value'
			},
			fields: {
				username: $scope.username,
				token: $rootScope.currentUser.token
			},
			file: file,
			fileFormDataName: 'myFile'
		});

		file.upload.then(
			function( response ) {
				$scope.validInvoice = true;
				$timeout(function () {
					var dataObj = response.data;
					file.result = dataObj
					if( dataObj.data.id ){
						$scope.getInvoice( dataObj.data.id );
					}
				});				
			}, function (response) {
				if (response.status > 0)
					$scope.errorMsg = response.status + ': ' + response.data;
			}
		);

		file.upload.progress(function (evt) {			
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));// Math.min is to fix IE which reports 200% sometimes
		});
    }

    $scope.getInvoice = function( id ){
    	$http.get( 'api/invoice.json?rnd=' + Math.random(), {
				params:{
					"id": id,
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

    };

} ] );