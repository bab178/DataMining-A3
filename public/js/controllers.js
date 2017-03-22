angular.module('DataMiningA3.controllers', [])
.controller('DashCtrl', function ($scope, SolrService) {
    $scope.q = "";

    var capitalize = function(s) {
        s = s.toString();
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    $scope.solr = function() {
        var displayResults = function (data) {
            var results = data.response.docs.sort(function (a, b) { return a.rank < b.rank });
            var numResults = data.response.numFound;
            $(".modal-header").html('<button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Solr Local Search Results</h4>' + "Top " + data.response.docs.length + " of " + numResults);
            var body = $("#solr-modal").find(".modal-body");
            $(body).html("");
            results.forEach(function (element) {
                var id = element.id;
                var artist = capitalize(element.Artist[0]);
                var song = capitalize(element.Song[0]);
                var lyrics = capitalize(element.Lyrics[0]);
                var rank = capitalize(element.Rank[0]);
                var source = capitalize(element.Source[0]);
                var year = capitalize(element.Year[0]);

                $(body).append("<div style='width: 100%;'><a href='/#!/detail?id=" + id + "'>" + song + " (" + year + ")" + " by " + artist + "</a></div>");
                if (element != results[results.length - 1]) {
                    $(body).append("<br/>");
                }
            }, this);
            $("#solr-modal").modal().show();
        }

        SolrService.Search($scope.q).done(displayResults).fail(function (err) { alert("Error code: " + err.status + "\nMessage: " + err.statusText); })
    }
})
    .controller('DetailCtrl', function ($scope, $stateParams, SolrService) {
    $('.modal-backdrop').remove();
        
    $scope.artist = "jay z";
    $scope.song = "walkin on sunshines";
    $scope.year = "2009";
    $scope.rank = "12";
    $scope.source = "2";
    $scope.id = "asdna90-asdasd-asd-sdcv";
    $scope.lyrics = "im walkin im walkin im walkin im walkin im walkin im walkin im walkin im walkin im walkin im walkin im walkin im walkin im walkin ";
});