/**
 * Created by amir on 16/05/16.
 */

module.exports = function (uri, rawHtml) {

    const cheerio = require('cheerio');
    const doc = cheerio.load(rawHtml);


    console.log( doc('input.share-embed-code').val() );

    return doc('input.share-embed-code');
}