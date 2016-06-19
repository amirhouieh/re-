function relToAbs(uri, url){
    /* Only accept commonly trusted protocols:
     * Only data-image URLs are accepted, Exotic flavours (escaped slash,
     * html-entitied characters) are not supported to keep the function fast */
    
    if(/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url))
        return url; //Url is already absolute

    var base_url = uri.href.match(/^(.+)\/?(?:#.+)?$/)[0]+"/";
    var startWith = url.substring(0,2);
    
    if(startWith == "//")
        return uri.protocol + url;
    else if(url.charAt(0) == "/")
        return uri.protocol + "//" + uri.host + url;
    else if(startWith == "./")
        url = "." + url;
    else if(/^\s*$/.test(url))
        return ""; //Empty = Return nothing
    else if( startWith == "..")
        return uri.protocol + "//" + uri.host + url.substr(2);
    else url = "../" + url;

    url = base_url + url;
    var i=0
    while(/\/\.\.\//.test(url = url.replace(/[^\/]+\/+\.\.\//g,"")));

    /* Escape certain characters to prevent XSS */
    url = url.replace(/\.$/,"").replace(/\/\./g,"").replace(/"/g,"%22")
        .replace(/'/g,"%27").replace(/</g,"%3C").replace(/>/g,"%3E");
    return url;
};


module.exports = {
    relToAbs: relToAbs
}