/**
 * Created by amir on 09/06/16.
 * */

module.exports = function (uri, rawHtml) {

    const cheerio = require('cheerio');
    const doc = cheerio.load(rawHtml);

    let referencesContainer = doc('.reflist');
    let newWrapper = doc('<div>');

    referencesContainer.each((i,refContainer)=>{
        // let type = doc(refContainer).prev().text().toLowerCase().replace(' ','');
        let ol = doc('<ol>');

        //remove back links
        doc(refContainer).find('.mw-cite-backlink').remove();

        //merge all refrences in one container
        ol.append( doc(refContainer).find('li') );
        newWrapper.append(ol);
    });


    return newWrapper;
}