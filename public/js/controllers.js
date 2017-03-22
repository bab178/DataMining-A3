angular.module('DataMiningA3.controllers', [])
.controller('DashCtrl', function ($scope, SolrService) {
    $scope.q = "";

    var capitalize = function(s) {
        s = s.toString();
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    $scope.solr = function() {
        var displayResults = function (data) {
            var results = data.response.docs.sort(function (a, b) { return a.Rank[0] > b.Rank[0] });
            $(".modal-header").html(
             '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
             '<h4 class="modal-title">Solr Local Search Results</h4>' +
             "Top " + data.response.docs.length + " of " + data.response.numFound);
            var body = $("#solr-modal").find(".modal-body");
            $(body).html("");
            results.forEach(function (element) {
                var id = element.id;
                var artist = capitalize(element.Artist[0]);
                var lyrics = capitalize(element.Lyrics[0]);
                var rank = element.Rank[0];
                var song = capitalize(element.Song[0]);
                var source = element.Source[0];
                var year = element.Year[0];

                $(body).append("<div style='width: 100%;'><a href='/#!/detail/" + id + "'>" + song + " (" + year + ")" + " by " + artist + "</a> <span style='float: right;'>Rank " + rank + "</div></div>");
                if (element != results[results.length - 1]) {
                    $(body).append("<br/>");
                }
            }, this);
            $("#solr-modal").modal().show();
        }
        SolrService.Search($scope.q)
        .done(displayResults)
        .fail(function (err) {
             alert("Error code: " + err.status + "\nMessage: " + err.statusText); 
        });
    }
})
.controller('DetailCtrl', function ($scope, $state, $stateParams, SolrService) {
    $('.modal-backdrop').remove();
    $scope.songinfo = {};
    var capitalize = function (s) {
        s = s.toString();
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    if ($stateParams.id != "") {
        SolrService.GetSongDetails($stateParams.id)
        .done(function (data) {
            var element = data.doc;
            $scope.songinfo = {
                id: element.id,
                artist:  capitalize(element.Artist[0]),
                lyrics:  capitalize(element.Lyrics[0]),
                rank:  element.Rank[0],
                song:  capitalize(element.Song[0]),
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

    $scope.returnToSearch = function() {
        $state.go("dash");
        window.location.reload(); // reload to reset gsce
    }
});