/**
 * Created by amir on 09/06/16.
 */

module.exports = function (uri, rawHtml) {

    const cheerio = require('cheerio');
    const doc = cheerio.load(rawHtml);

    let linksWrapper = doc('<section>').append(doc('a'))
    return linksWrapper;
    
}