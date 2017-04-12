angular.module('DataMiningA3.controllers', [])
.controller('DashCtrl', function ($scope, $state, SolrService) {
    $scope.q = "";
    $scope.solr = function() {
        $state.go('results', $scope.q);
    }
})
.controller('DetailCtrl', function ($scope, $state, $stateParams, SolrService) {
    $scope.songinfo = {};
    var capitalizeAll = function (s) {
        s = s.toString();
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    if ($stateParams.id != "") {
        SolrService.GetSongDetails($stateParams.id)
        .done(function (data) {
            var element = data.doc;
            $scope.songinfo = {
                id: element.id,
                artist:  capitalizeAll(element.Artist[0]),
                lyrics:  element.Lyrics[0],
                rank:  element.Rank[0],
                song:  capitalizeAll(element.Song[0]),
                source:  element.Source[0],
                year:  element.Year[0],
            };
         })
        .fail(function (err) {
            alert("Error code: " + err.status + "\nMessage: " + err.statusText);
        });
    }
    else{
        $state.go('dash');
    }
    $(document).ajaxStop(function () { 
        $(".panel-heading").html("Lyrics for: " + $scope.songinfo.song + "(" + $scope.songinfo.year + ") by " + $scope.songinfo.artist);
        $scope.$apply(); 
    });
})
.controller('ResultsCtrl', function ($scope, $state, $stateParams, SolrService) {
    $scope.results = {};
    $scope.loading = true;
    $scope.capitalizeAll = function (s) {
        s = s.toString();
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    if ($stateParams.query != "") {
        SolrService.Search($stateParams.query)
        .done(function(data) {
            // Sort results by Rank
            $scope.results = data.response.docs.sort(function (a, b) { return a.Rank[0] > b.Rank[0] });
            $scope.numFound = data.response.numFound;
            $scope.loading = false;
            $scope.$apply();
        })
        .fail(function (err) {
             alert("Error code: " + err.status + "\nMessage: " + err.statusText); 
        });
    }
    else {
        $state.go('dash');
    }
});