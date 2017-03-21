angular.module('DataMiningA3.controllers', [])
.controller('DashCtrl', function ($scope, $state, $http, $rootScope) {
    $scope.q = "";

    var capitalize = function(s) {
        s = s.toString();
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    $scope.solr = function() {
        var displayResults = function (data) {
            var results = data.response.docs.sort(function (a, b) { return a.rank < b.rank });
            var numResults = data.response.numFound;
            $(".modal-header").append(" Top 10 of " + numResults);
            var body = $("#solr-modal").find(".modal-body");
            results.forEach(function (element) {
                var id = element.id;
                var artist = capitalize(element.Artist[0]);
                var song = capitalize(element.Song[0]);
                var lyrics = capitalize(element.Lyrics[0]);
                var rank = capitalize(element.Rank[0]);
                var source = capitalize(element.Source[0]);
                var year = capitalize(element.Year[0]);

                $(body).append("<div style='width: 100%;'><a href='http://52.35.144.231:8983/solr/lyrics/select?q=" + id + "'>" + song + " (" + year + ")" + " by " + artist + "</a></div>");
                if (element != results[results.length - 1]) {
                    $(body).append("<br/>");
                }
            }, this);
        }
        
        jQuery.get({
            method: 'GET',
            url: 'http://52.35.144.231:8983/solr/lyrics/select?wt=json&q=' + $scope.q,
            dataType: 'jsonp',
            'jsonp': 'json.wrf',
            beforeSend: function (xhr) { xhr.setRequestHeader('Access-Control-Allow-Origin', '*'); },
        }).done(displayResults);
    }
});