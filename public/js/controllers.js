angular.module('DataMiningA3.controllers', [])
.controller('DashCtrl', function ($scope, $state, $http, $rootScope) {
    $scope.q = "";
    $scope.solr = function() {
        jQuery.get({
            type: 'GET',
            url: 'http://52.35.144.231:8983/solr/lyrics/select?debug=query&wt=json&q=' + $scope.q,
            contentType: 'json',
            dataType: "json"
        }).done(function (data) {
            alert("Data Loaded: " + data);
        });
    }
});