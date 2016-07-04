/**
 * Created by amir on 06/05/16.
 */

var whiteSpaceRegex = /\s/g;

module.exports = function(html, lng) {

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


    function extractTextualPage() {
        var ex = extractor.lazy(html,lng);
        return ex.html();
    };

    function getNodeNetText() {
        return doc(this).text().replace(whiteSpaceRegex,'').trim();
    };

}

