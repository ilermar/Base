'use strict';

/**
 * @ngdoc overview
 * @name baseApp
 * @description
 * # baseApp
 *
 * Main module of the application.
 */
angular
  .module( 'baseApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ] )
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/invoices', {
        templateUrl: 'views/invoices.html',
        controller: 'InvoiceCtrl',
        controllerAs: 'invoicectrl'
      })
      .when('/setinvoice', {
        templateUrl: 'views/setinvoice.html',
        controller: 'UpInvoiceCtrl',
        controllerAs: 'upinvoicectrl'
      })
      .when('/help', {
        templateUrl: 'views/help.html',
        controller: 'HelpCtrl',
        controllerAs: 'helpctrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'aboutctrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'registerctrl'
      })
      .otherwise({
        redirectTo: '/main'
      });
    //$httpProvider.interceptors.push('httpInterceptor');
  })

  .factory('Auth', function(){
    var user = null;

    return{
        setUser : function(aUser){
            user = aUser;
        },
        isLoggedIn : function(){
            return (user) ? user : false;
        }
      };
  })

  .run(['$rootScope', '$location', '$timeout', 'Auth', function ($rootScope, $location, $timeout, Auth) {
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.needsLogIn = false;
        var isLogged = Auth.isLoggedIn();
        var url = $location.path();
        var ext = ( url.substr(1 + url.lastIndexOf("/") )
                      .split('?')[0])
                      .substr( url.lastIndexOf(".") );
        if( ext === "pdf" || ext === "xml" ){
          
        }else if( !Auth || ( !isLogged && $location.path() !== '/register' ) ){
            $location.path('/main');
        } else{            
          $rootScope.needsLogIn = true;
        }
        $rootScope.closeAlert();
    });

    $rootScope.closeAlert = function(){
      $rootScope.showAlert = false;
    };

    $rootScope.showMessage = function(message, timeoutValue, alertType, fnAfterTimeout){
      if($rootScope.currentTimeoutAlert){
        $timeout.cancel($rootScope.currentTimeoutAlert);
        $rootScope.currentTimeoutAlert = null;
      }
      if($rootScope.currentUser){
        $rootScope.showAlert = true;
        $rootScope.alertType = alertType ? alertType : 'danger';
        $rootScope.serverMessage = message;
        $rootScope.currentTimeoutAlert = $timeout(function(){ 
          $rootScope.showAlert = false; 
          if(fnAfterTimeout){
            fnAfterTimeout();
          }
        }, timeoutValue ? timeoutValue : 10000);
      }else{
        $rootScope.showLoginAlert = true;
        $rootScope.loginAlertType = alertType ? alertType : 'danger';
        $rootScope.loginMessage = message;
        $rootScope.currentTimeoutAlert = $timeout(function(){ 
          $rootScope.showLoginAlert = false;
          if(fnAfterTimeout){
            fnAfterTimeout();
          } 
        }, timeoutValue ? timeoutValue : 10000);
      }
    };
}]);