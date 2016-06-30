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


module.exports = {
    relToAbs: relToAbs
}