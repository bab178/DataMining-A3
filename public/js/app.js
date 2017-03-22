angular.module('DataMiningA3', ['ui.router', 'DataMiningA3.controllers', 'DataMiningA3.services'])
.config(function($stateProvider, $urlRouterProvider) {
    
    // Views and Routes
    $stateProvider
    .state('dash', {
        url: '/dashboard',
        templateUrl: 'templates/dash.html',
        controller: 'DashCtrl'
    })
    .state('detail', {
        url: '/detail/:id',
        templateUrl: 'templates/detail.html',
        controller: 'DetailCtrl'
    });
    
    // Route not found go to /dashboard
    $urlRouterProvider.otherwise('/dashboard');
});