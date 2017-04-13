angular.module('DataMiningA3.controllers', [])
.controller('DashCtrl', function ($scope, $state, SolrService) {
    $scope.q = "";
    $scope.solr = function() {
        if($scope.q != "") {
            $state.go('results', { query: $scope.q });
        }
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
    $scope.selection = [];
    $scope.capitalizeAll = function (s) {
        s = s.toString();
        return s.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
        .replace("And", "and")
        .replace("Featuring", "featuring")
        .replace("Feat", "feat");
    };

    $scope.toggleSelection = function toggleSelection(id) {
        var idx = $scope.selection.indexOf(id);
        var $allboxes = $('input[type="checkbox"]');
        
        if (idx > -1) { // Is currently selected
            $scope.selection.splice(idx, 1);
        }
        else { // Is newly selected
            $scope.selection.push(id);
        }

        if($scope.selection.length < 5) {
            // enable all
            $allboxes.each(function(index) {
                $allboxes[index].disabled = false;
            }, this);
        }
        else {
            // disable other than selected
            $allboxes.each(function(index) {
                var id = $allboxes[index].value;
                if($scope.selection.indexOf(id) == -1) {
                    $allboxes[index].disabled = true;
                }    
            }, this);
        }
    };

    $scope.relevancefeedback =function() {
      console.log($scope.selection);  
    };

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