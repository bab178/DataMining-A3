angular.module('DataMiningA3.controllers', [])
.controller('DashCtrl', function ($scope, SolrService) {
    $scope.q = "";
    var $body = $("#solr-modal .modal-body");

    // Captialize the first letter of all words excluding a select few
    var capitalizeAll = function(s) {
        s = s.toString();
         return s.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
         .replace("And", "and")
         .replace("Featuring", "featuring")
         .replace("Feat", "feat");
    }

    var displayResultsModal = function (data) {
        // Sort results by Rank
        var results = data.response.docs.sort(function (a, b) { return a.Rank[0] > b.Rank[0] });
        
        // Write results summary to header
        $(".modal-header").html(
            '<h4 class="modal-title">Solr Local Search Results</h4>' +
            "Top " + results.length + " of " + data.response.numFound + 
            "<span style='float: right;'>Relevant?</span>");
        
        // Clear Modal Body
        $body.html("");

        // Create a row in Body for each result
        if(results.length > 0) {
            results.forEach(function (element) {
                var id = element.id;
                var artist = capitalizeAll(element.Artist[0]);
                var lyrics = capitalizeAll(element.Lyrics[0]);
                var rank = element.Rank[0];
                var song = capitalizeAll(element.Song[0]);
                var source = element.Source[0];
                var year = element.Year[0];
                $body.append(
                    "<div style='width: 100%;'>" + 
                        "<a href='/#!/detail/" + id + "'>" + song + " (" + year + ")" + "<br/>by " + artist + "</a> <input type='checkbox' style='float: right;' value='" + id + "'/>" + 
                    "</div>");
                if (element != results[results.length - 1]) {
                    $body.append("<hr style='margin:5px 0px 5px 0px;'/>");
                }
            }, this);
        }
        else {
            $body.append("<div style='width: 100%;'>No Results Found</div>");
        }
        $("#solr-modal").modal("show");
    }

    $scope.solr = function() {
        SolrService.Search($scope.q)
        .done(displayResultsModal)
        .fail(function (err) {
             alert("Error code: " + err.status + "\nMessage: " + err.statusText); 
        });
    }

    $scope.rerank = function() {
        $body.html("<div style='width:100%'>Loading...</div>");

    }
})
.controller('DetailCtrl', function ($scope, $state, $stateParams, SolrService) {
    $('.modal-backdrop').remove();
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
                lyrics:  capitalizeAll(element.Lyrics[0]),
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
    $(document).ajaxStop(function () { 
        $(".panel-heading").html("Lyrics for: " + $scope.songinfo.song + "(" + $scope.songinfo.year + ") by " + $scope.songinfo.artist);
        $scope.$apply(); 
    });
});