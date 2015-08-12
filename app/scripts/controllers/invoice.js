'use strict';

/**
 * @ngdoc function
 * @name baseApp.controller:InvoiceCtrl
 * @description
 * # InvoiceCtrl
 * Controller of the baseApp
 */
angular.module('baseApp')
  .controller('InvoiceCtrl', [ '$rootScope', '$scope', '$http',
  	function ( $rootScope, $scope, $http ) {

  		$scope.isCollapsed 	= true;
  		$scope.companies 	= [];
  		$scope.businesses 	= [];
  		$scope.currencies 	= [ { "value":"1","text":"MXN" }, { "value":"2","text":"USD" } ];
  		$scope.statuss 		= [ { "value":"1","text":"En autorización" }, { "value":"2","text":"Recibida" }, { "value":"3","text":"Pagada" }, { "value":"4","text":"Rechazada" }, { "value":"5","text":"Bloqueada" } ];
  		$scope.invoices 	= [];
  		$scope.resume 		= [];
  		$scope.filters 		= {};
  		$scope.searchEnable = false;
  		$scope.queryReady 	= 0;
		
		var today = new Date();
  		$scope.fl 			= {
  			company: "0",
  			business: "0",
  			status:"0",
  			currency:"0",
  			startDate : ( today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() ),
			endDate	: ( today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() )
  		};

	    $scope.loadDashboard = function(){
			if($rootScope.currentUser){ //session
				$http.get( 'api/companies.json?rnd=' + Math.random() )
					.success(function(response, status) {
						$scope.queryReady++;
						$rootScope.dataLoading = false;
						if(status === 200){
							var data = response.data;
							$scope.companies = data.companies;
						}else{
							$scope.companies = [];
						}
						if( $scope.queryReady >= 2 ){
							$scope.searchEnable = true;
						}
					})
					.error(function(){
						//alert
					}
				);
				$http.get( 'api/businesses.json?rnd=' + Math.random() )
					.success(function(response, status) {
						$scope.queryReady++;
						$rootScope.dataLoading = false;
						if(status === 200){
							var data = response.data;
							$scope.businesses = data.businesses;
						}else{
							$scope.businesses = [];
						}
						if( $scope.queryReady >= 2 ){
							$scope.searchEnable = true;
						}
					})
					.error(function(){
						//alert
					}
				);

				$scope.setFilters();
	    		$scope.search();
			}//if session
	    };

	    $scope.setFilters = function(){

	    	$scope.filters = $scope.fl;
			/*
				company
				business
				folio
				starDate
				endDate
				currency
				status
			*/
	    };

	    $scope.search = function(){
	    	$http.get( 'api/invoices.json?rnd=' + Math.random(), {
					params:$scope.filters 
				} ).then(
		        	function(response) {
		            	if(response.status === 200){
		            		var data = response.data.data;
		        			$scope.invoices = data.invoices;
		        			$scope.resume 	= data.resume;
		            	}else{
		              		$scope.invoices = [];
		              		$scope.resume	= [];
		            	}
		        	}, function() {
		        		//error
					}
				);

	    };

	    $scope.searchByFilter =function(){
	    	$scope.setFilters();
	    	$scope.search();
	    	$scope.isCollapsed 	= true;
	    };
/**** Manejo de filtros de fechas */
	    $scope.open = function($event) {
      		$event.preventDefault();
      		$event.stopPropagation();

      		$scope.opened = true;
    	};

	    $scope.dateOptions = {
	      formatYear: 'yyyy',
	      startingDay: 1
	    };

	    $scope.eopen = function($event) {
      		$event.preventDefault();
      		$event.stopPropagation();

      		$scope.eopened = true;
    	};

	    $scope.edateOptions = {
	      formatYear: 'yyyy',
	      startingDay: 1
	    }; 
/************************************** fechas */	    

	    $scope.loadDashboard();
 } ] );