/**
 * Created by amir on 16/05/16.
 */

module.exports = function (uri, rawHtml) {

    const cheerio = require('cheerio');
    // const doc = cheerio.load();

    // let wrapper = doc('<div class="formatted">');

    // <h1 class="formatted">Re-</h1><p id="welcomenot" class="formatted"><strong>Wellcome to Re-</strong><span>your first modular content-driven web browser</span></p>
    
    return '<ul id="top-visits" class="formatted"></ul>';

}