/**
 * Created by amir on 06/05/16.
 */

var whiteSpaceRegex = /\s/g;

module.exports = function(urlSet, html, lng) {

    const cheerio = require('cheerio');
    const extractor = require('unfluff');

    const self = this;
    const doc = cheerio.load(html);

    //default module (text)
    self.mainArticle = function () {

        //try to get text based content
        var textualPageContent = extractTextualPage();
        var rawText = getNodeNetText.call(textualPageContent);
        var textRatio = textualPageContent.text().length/html.length;

        //text-based page
        if( textualPageContent && (textRatio>=0.1 || rawText.length >=300 ) ) {

            doc(textualPageContent).find('img').each((i,img)=>{
                doc(img).remove();
                img.attribs.src = null;
            });

            var tagsToRemove = ['header','.header','.footer','footer','button','iframe', 'form','input', 'nav'];


    doc(textualPageContent).find(tagsToRemove.join(',')).remove();


    // remove navbars
    doc(textualPageContent).find('*').each((i,node)=>{

        let nodeLinkSize = doc(node).find('a').length;
        let nodeElemSize = doc(node).find('*').length;

        let nodeLinkDensity = nodeLinkSize/nodeElemSize;


        if(nodeLinkDensity>0.3 && nodeLinkDensity<1) {
            doc(node).remove();
        }

    });



            return doc(textualPageContent);
        }
        

        // else{
        //     //might be image based content
        //     var imageBasedContent = extractVisualPage();
        //
        //     if( imageBasedContent ) {
        //         console.log('visual page');
        //         return imageBasedContent;
        //     }
        //     else {
        //         console.log('try for metadata');
        //         let metadata = self.metadata();
        //
        //         if(metadata)
        //             return metadata;
        //
        //         return 'has nothing';
        //     }
        // }

    }

    //default module (metadata)
    self.metadata = function() {
        const ex = extractor.lazy(html,lng);
        var metaProps = ['author','date','description','lang','publisher','keywords','title','description'];
        var ul = doc('<ul class="formatted">');
        var hasMeta;

        for(var x=0; x<metaProps.length; x++){

            var metaname = metaProps[x];
            var metaval = ex[ metaname ]();

            if(metaval) {
                var li = doc('<li>');
                li.text( metaname + ": " + metaval );
                ul.append(li);
                hasMeta = true;
            }
        }

        if( hasMeta ) return ul;
        return null;
    }


    function extractVisualPage() {

        var imageParents = [];


        // let allTextNodes = doc('body *').contents().filter((i,node)=>node.type=="tag");
        // let imagesNumber = doc('img').length;
        // let textLength = getNodeNetText.call(allTextNodes).length;
        // let numberofTextNodes = allTextNodes.length;
        // console.log(allTextNodes);
        // console.log('number of images: ',imagesNumber,numberofTextNodes,textLength  )
        // console.log('image/text', imagesNumber/numberofTextNodes);

        doc('img').each(function(){
            var res = findImgWrapper(this);

            if(res) {
                res.find('img').remove();
                imageParents.push(res);
            }

        });

        if(!imageParents.length)
            return null;

        return wrap(imageParents,'<ul>');
    };

    function extractTextualPage() {
        var ex = extractor.lazy(html,lng);
        return ex.html();
    };

    function findImgWrapper(node){

        var netText = getNodeNetText.call(node);

        if(netText.length>=10){

            if( netText.length >= 20 && node.name !== "body"){
                return wrap(node,'<li>');
            }
            else
                return null
        }

        if(node.parent)
            return findImgWrapper( node.parent );

        return null;
    };

    function wrap(node, wrapperTag, classname) {
        var wrapper = doc(wrapperTag);
        classname = classname? classname+' formatted': 'formatted';
        wrapper.attr('class',classname);
        return wrapper.append(node);
    };

    function getNodeNetText() {
        return doc(this).text().replace(whiteSpaceRegex,'').trim();
    };

    function isNavigationWrapper(node) {

        if(!node) return;

        let linksInNodeText = getNodeNetText.call( doc(node).find('a') );
        let nodeText = getNodeNetText.call(node);

        // if( linksInNodeText.length/nodeText.length == 1 )
        //     return false;

        return linksInNodeText.length/nodeText.length > 0.4;

    };

}

