module.exports = Formatter;


function Formatter(){

    const whiteSpaceRegex = /\s/g;
    const urlTool = require('./url-utils');
    const cheerio = require('cheerio');

    var uri;
    var doc;
    const self = this;

    const formatActionTable = {

        "badTags": function () {

            if(doc(this).hasClass('formatted')){
                return doc(this);
            }

            return doc(this).remove();
        },

        "links": function () {


            if( isEmptyNode.call(this) || !this.attribs.href)
                return doc(this).remove();


            var href = urlTool.relToAbs(uri,this.attribs.href);
            var hasImg =  doc(this).find('img');

            if(hasImg.length){
                return doc(this).replaceWith(hasImg);
            }else if(!href){
                return doc(this).html();
            }

            return doc(this).replaceWith( '<span title="'+href+'" class="link formatted" onclick="navigateHandler(this)" _href="'+ href +'">' + doc(this).html() + '</span>' );
        },

        "images": function () {

            if( !this.attribs.src )
                return doc(this);


            var src = this.attribs.src;

            // //remove all attributes
            this.attribs= {};

            // //add new attributes
            this.attribs.src = urlTool.relToAbs(uri,src);
            this.attribs.class = "formatted";

            return doc(this);
        },

        'removeAttr': function () {

            if(doc(this).hasClass('formatted')){
                return doc(this);
            }

            this.attribs = {};
            return doc(this);
        }

    }

    self.do = function(_uri,content) {
        
         if(!content.length || typeof content !== 'object')
             return 'problem to load content!';

        uri = _uri;
        doc = cheerio.load(content);

        if(content.hasClass('formatted')){
            var temp = content[0].attribs;
            content[0].attribs = {};
            for(var x in temp)
                content[0].attribs[x] = temp[x];
        }
         else
             content[0].attribs = {};


         formatImages(content);
         formatLinks(content);
         removeBadTags(content);
         removeAttr(content);

        let contentWrapper = doc('<div>');
        contentWrapper.addClass('module-content-wrapper');

        contentWrapper.append( doc(content).attr('name',uri.hostname) );

         return contentWrapper;
    };

    function removeAttr(content) {
        doc(content).find('*:not(img,a)').each( function () {
            return formatActionTable['removeAttr'].call(this);
        });
    };

    function formatImages(content) {

        doc(content).filter('img').each(function () {
            return formatActionTable.images.call(this);
        })

    };

    function formatLinks(content) {
        doc(content).find('a').each(function(){
            return formatActionTable.links.call(this);
        });
    }

    function removeBadTags(content) {
        doc(content).find('*').each(function () {
            if( isEmptyNode.call(this) || this.name == "script" || this.name == "link" )
                return formatActionTable.badTags.call(this);
        });
    };

    function isEmptyNode() {
        return getNodeNetText.call(this).length ==0;
    };

    function getNodeNetText() {
        return doc(this).text().replace(whiteSpaceRegex,'').trim();
    };

    return this;
}