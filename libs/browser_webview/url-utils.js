const isAbsRegex = /^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i;
const isEmptyRegex = /^\s*$/;
const badCharRegex = /\/\.\.\//;
const badCharRegexRep = /[^\/]+\/+\.\.\//g;
const preventXssRegex = /\.$/;
const preventXssRep = /\/\./g;
const doubleQouteRegex = /"/g;
const singleQouteRegex = /"/g;
const greaterSignRegex = /</g;
const smallerSignRegex = />/g;
const isUrlRegex = /^(?:f|ht)tps?\:\/\//;

function relToAbs(uri, url){
    /* Only accept commonly trusted protocols:
     * Only data-image URLs are accepted, Exotic flavours (escaped slash,
     * html-entitied characters) are not supported to keep the function fast */

    if(isAbsRegex.test(url))
        return url; //Url is already absolute


    var base_url = uri.protocol+'//'+uri.host;
    var startWith = url.substring(0,2);
    
    if(startWith == "//")
        return uri.protocol + url;
    else if(url.charAt(0) == "/")
        return uri.protocol + "//" + uri.host + url;
    else if(startWith == "./")
        url = "." + url;
    else if(isEmptyRegex.test(url))
        return ""; //Empty = Return nothing
    else if( startWith == "..")
        return uri.protocol + "//" + uri.host + url.substr(2);
    else url = "/" + url;

    url = base_url + url;

    var i=0
    while(badCharRegex.test(url = url.replace(badCharRegexRep,"")));

    /* Escape certain characters to prevent XSS */
    url = url.replace(preventXssRegex,"").replace(preventXssRep,"").replace(doubleQouteRegex,"%22")
        .replace(singleQouteRegex,"%27").replace(greaterSignRegex,"%3C").replace(smallerSignRegex,"%3E");
    return url;
};


function addhttp(url) {
    if (!isUrlRegex.test(url)) {
        url = "http://" + url;
    }
    return url;
}

function parse(url) {
    url = url.trim() // remove whitespace common on copy-pasted url's

    if (!url) {
        return ':home'
    }
    // if the url starts with a (supported) protocol, do nothing
    if (urlParser.isURL(url)) {
        return url
    }

    if (url.indexOf('view-source:') === 0) {
        var realURL = url.replace('view-source:', '')

        return 'view-source:' + urlParser.parse(realURL)
    }

    // if the url doesn't have a space and has a ., or is a host from hosts file, assume it is a url without a protocol
    if (urlParser.isURLMissingProtocol(url)) {
        return 'http://' + url
    }
    // else, do a search
    return currentSearchEngine.searchURL.replace('%s', encodeURIComponent(url))
}


module.exports.relToAbs = relToAbs;
module.exports.addhttp = addhttp;