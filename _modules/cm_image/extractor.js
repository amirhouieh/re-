/**
 * Created by amir on 16/05/16.
 */

module.exports = function (uri, rawHtml) {

    const cheerio = require('cheerio');
    const doc = cheerio.load(rawHtml);
    let newHtml = "<div class='newhtml'>";

    var srcs = [];
    let test = doc('<ul>');
    let kir = [];
    var whiteSpaceRegex = /\s/g;
    var maxNumberOfLevelToGoUp = 5;
    var tagsToRemove = ['header','footer'];


    doc(tagsToRemove.join(',')).remove();

    //remove duplicate images
    let images = doc('img').filter(function () {
        if(srcs.indexOf(this.attribs.src) == -1){
            srcs.push(this.attribs.src);
            return true;
        }else{
            return false;
        }
    });


    return images;


    images.each((i,img)=>{
        let block = findImageBlock(img);
        let blockImage = doc(block).find('img');

        if(blockImage.length==1){
            newHtml += "<div>" + doc(block).html() + doc(img).html() + '</div>';
        }
    });

    function findImageBlock(img) {
        let block = img;
        let l = 0;

        while(block.parent.name!=='body'&& getNodeNetText.call(block).length <= 10 && l<=maxNumberOfLevelToGoUp){
            block = block.parent;
            l++;
        }

        return block;
    }
    function getNodeNetText() {
        let text = doc(this).text();
        return text.replace(whiteSpaceRegex,'').trim();
    };

    return newHtml+"</div>";

}