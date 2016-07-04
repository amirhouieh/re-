/**
 * Created by amir on 16/05/16.
 */

module.exports = function (uri, rawHtml) {

    const cheerio = require('cheerio');
    const doc = cheerio.load(rawHtml);
    const badTags = ["#ads",'img'];



    console.log(uri);


    return doc('.section-list');

}