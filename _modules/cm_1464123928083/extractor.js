/**
 * Created by amir on 16/05/16.
 */

module.exports = function (uri, rawHtml) {
    const ContentExtractor = require('./lib/content-extractor');
    var ce = new ContentExtractor(rawHtml,'en');
    return ce.mainArticle();
}