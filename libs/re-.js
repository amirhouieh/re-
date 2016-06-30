/**
 * Created by amir on 26/05/16.
 */

const badTags = ["noscript","link","script","style"];
const whiteSpaceRegex = /\s/g;
const cheerio = require('cheerio');

class Extractor{

    constructor(html){
        this.doc = cheerio.load(html);
        this.removeBadTags();
    }


    removeBadTags(){

        this.doc(badTags.join(',')).each((i,badTag)=>{
            return this.doc(badTag).remove();
        });

    }

    navBarSelector(){

        let navBarsClassNames = [];

        this.doc('body *').each((i,node)=>{

            let nodeLinkSize = this.doc(node).find('a').length;
            let nodeElemSize = this.doc(node).find('*').length;

            let nodeLinkDensity = nodeLinkSize/nodeElemSize;

            if(nodeLinkDensity>0.3 && nodeLinkDensity<1 && node.attribs.class)
                navBarsClassNames.push('.'+node.attribs.class.split(' ').join('.'));
        });
        
        return navBarsClassNames;
    }

    netText(node) {
        return this.doc(node).text().replace(whiteSpaceRegex,'').trim();
    };


}


module.exports.Extractor = Extractor;
