angular.module('DataMiningA3.services', [])
.service('SolrService', function () {
    this.Search = function(q) {
        return jQuery.get({
            method: 'GET',
            url: 'http://52.35.144.231:8983/solr/lyrics/select?wt=json&q=' + q,
            dataType: 'jsonp',
            'jsonp': 'json.wrf',
            beforeSend: function (xhr) { xhr.setRequestHeader('Access-Control-Allow-Origin', '*'); },
        });
    };
});