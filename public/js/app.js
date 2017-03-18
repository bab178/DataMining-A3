angular.module('DataMiningA3', ['ui.router', 'DataMiningA3.controllers'])

.config(function($stateProvider, $urlRouterProvider) {
    
    // Views and Routes
    $stateProvider
    .state('dash', {
        url: '/dashboard',
        templateUrl: 'templates/dash.html',
        controller: 'DashCtrl'
    });
    
    // Route not found go to /dashboard
    $urlRouterProvider.otherwise('/dashboard');
});