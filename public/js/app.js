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
    })
    .state('results', {
        url: '/results/:query',
        templateUrl: 'templates/results.html',
        controller: 'ResultsCtrl'
    });
    
    // Route not found go to /dashboard
    $urlRouterProvider.otherwise('/dashboard');
});