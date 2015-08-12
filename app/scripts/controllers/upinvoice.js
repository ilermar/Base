'use strict';

/**
 * @ngdoc function
 * @name baseApp.controller:UpInvoiceCtrl
 * @description
 * # UpInvoiceCtrl
 * Controller of the baseApp
 */
angular.module('baseApp')
.controller('UpInvoiceCtrl', [ "$scope", function ($scope) {
	$scope.submit = function() {
		console.log( "Enviar factura" );
	};
} ] );