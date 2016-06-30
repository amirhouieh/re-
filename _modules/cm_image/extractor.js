/**
 * Created by amir on 16/05/16.
 */

// const {Extractor} = require('../../libs/re-');

module.exports = function (uri, rawHtml) {

    const cheerio = require('cheerio');
    const doc = cheerio.load(rawHtml);
    let newHtml = "<div class='newhtml'>";

    var srcs = [];
    let imagesWrapper = doc('<div class="formatted __images_wrapper__">');
    var whiteSpaceRegex = /\s/g;
    var maxNumberOfLevelToGoUp = 5;
    var tagsToRemove = ['header','.header','.footer','footer','button','iframe', 'form','input', 'nav'];



    //remove duplicate images
    let images = doc('img').filter(function () {

        if(srcs.indexOf(this.attribs.src) == -1){
            srcs.push(this.attribs.src);
            return true;
        }else{
            return false;
        }
    });


    if(!images.length)
        return "";


    images.each((i,img)=>{
        let block = findImageBlock(img);
        let blockImage = doc(block).find('img');

        if(blockImage.length==1){
            imagesWrapper.append(doc(block).addClass('__image-wrapper__,formatted'));
        }else{
            imagesWrapper.append(img)
        }

    });

    function findImageBlock(img) {
        let block = img;
        let l = 0;

        while(block.parent.name!=='body'&& getNodeNetText.call(block.parent).length <= 60 && l<=maxNumberOfLevelToGoUp){
            block = block.parent;
            l++;
        }

        return block;
    }
    function getNodeNetText() {
        let text = doc(this).text();
        return text.replace(whiteSpaceRegex,'').trim();
    };



    doc(imagesWrapper).find(tagsToRemove.join(',')).remove();


    // remove navbars
    doc(imagesWrapper).find('*').each((i,node)=>{

        let nodeLinkSize = doc(node).find('a').length;
        let nodeElemSize = doc(node).find('*').length;

        let nodeLinkDensity = nodeLinkSize/nodeElemSize;

        if(nodeLinkDensity>0.5 && nodeLinkDensity<1) {
            doc(node).remove();
        }

    });


    return imagesWrapper;

}