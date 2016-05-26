/**
 * Created by amir on 16/05/16.
 */

module.exports = function (uri, rawHtml) {

    const cheerio = require('cheerio');
    const doc = cheerio.load(rawHtml);

    var srcs = [];

    return doc('img').filter(function () {

        if(srcs.indexOf(this.attribs.src) == -1){
            srcs.push(this.attribs.src);
            return true;
        }else{
            return false;
        }

    });
    
}