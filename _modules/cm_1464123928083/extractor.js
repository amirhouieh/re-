/**
 * Created by amir on 16/05/16.
 */

module.exports = function (uri, rawHtml) {

    const UrlParser = require('./lib/url-parser');
    const ContentExtractor = require('./lib/content-extractor');
    
    var urlSet = new UrlParser(uri);
    var ce = new ContentExtractor(urlSet,rawHtml,'en');
    
    return ce.mainArticle();
}

