/**
 * Created by amir on 16/05/16.
 */

module.exports = function (uri, rawHtml) {


    const cheerio = require('cheerio');
    const doc = cheerio.load(rawHtml);

    let collections = null;

    if( uri.host == "www.bbc.com"){
        collections = doc('.media');
    }else{
        collections = doc('.collection').addClass('__news-item__');
        collections.find('.subscribe-wrapper').remove();
    }

    return collections;
}