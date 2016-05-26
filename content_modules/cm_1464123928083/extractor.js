/**
 * Created by amir on 16/05/16.
 */

module.exports = function (uri, rawHtml) {

    const UrlParser = require('./lib/url-parser');
    const ContentExtractor = require('./lib/content-extractor');

    var urlSet = new UrlParser(uri);
    var ce = new ContentExtractor(urlSet,rawHtml,'en');

    if( urlSet.searchEngine && !urlSet.isQuery ){
        console.log('is search engine index');
        return ce.searchInput();
    }

    if(urlSet.isQuery){
        console.log('it has search query');
        return ce.searchResult();
    }

    console.log('it is normal page, text based or image based or kir based');
    return ce.mainArticle();

}

