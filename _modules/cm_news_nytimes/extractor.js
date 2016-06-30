/**
 * Created by amir on 16/05/16.
 */

module.exports = function (uri, rawHtml) {

    const cheerio = require('cheerio');
    const doc = cheerio.load(rawHtml);
    // let collection = doc('.collection');
    // collection.find('.subscribe-wrapper').remove();
    // return collection;


    return doc('.media-list__item');




}