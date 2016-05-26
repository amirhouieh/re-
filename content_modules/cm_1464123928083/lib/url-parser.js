/**
 * Created by amir on 06/05/16.
 */

const UrlPattern = require('url-pattern');
const pattern = new UrlPattern('(http(s)\\://)(:subdomain.):domain.:tld(\\::port)(/*)');
const queryRegex = /(q=([^&]*)|search=([^&]*))/;

var searchEngineList = {

    'google': {
        'name': 'google',
        'sub-and-domain': 'www.google',
        'item-selector': 'div.g',
        'search-query': 'http://www.google.com/search?q='
    },

    'bing': {
        'name': 'bing',
        'sub-and-domain': 'www.bing',
        'item-selector': 'li.b_algo',
        'search-query':'http://www.bing.com/search?q='
    },

    'duckduckgo': {
        'name': 'duckduckgo',
        'sub-and-domain': 'www.duckduckgo',
        'item-selector': 'div.result',
        'search-query':'https://duckduckgo.com/?q='
    }

}

var querySelectors = {
    'ted': 'article.search__result'
}


module.exports = URL = function(uri) {

    var patternMatch = pattern.match(uri.href);

    this.uri = uri;
    this.searchEngine = searchEngineList[ patternMatch.domain ];
    this.isQuery = uri.query && uri.query.match(queryRegex);
    this.itemSelector = querySelectors[patternMatch.domain];

};