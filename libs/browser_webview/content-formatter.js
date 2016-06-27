module.exports = Formatter;

const imageDataUrlRegex = /^data:image\/(png|jpg|jpeg|gif);base64,/;

function Formatter(){

    const whiteSpaceRegex = /\s/g;
    const urlTool = require('./url-utils');
    const cheerio = require('cheerio');

    var uri;
    var doc;
    const self = this;
    const badAttrs = ['style', 'onclick', 'data'];

    const formatActionTable = {

        "isLongText": function () {
            if(doc(this).hasClass('formatted')){
                return doc(this);
            }

            if(doc(this).text().length>100)
                doc(this).addClass('longtext');

            return doc(this);
        },

        "badTags": function () {


            if(doc(this).hasClass('formatted')){
                return doc(this);
            }

            return doc(this).remove();
        },

        "links": function () {

            if( isEmptyNode.call(this) || !this.attribs.href)
                return doc(this).remove();

            if(doc(this).hasClass('formatted')){
                return doc(this);
            }

            var href = urlTool.relToAbs(uri,this.attribs.href);

            // if(!href){
            //     return doc(this).html();
            // }

            return doc(this).replaceWith('<a href="javascript:;" title="'+href+'" class="link formatted" onclick="navigate(this);" _href="'+ href +'">' + doc(this).html() + '</a>');
        },

        "images": function () {

            if( !this.attribs.src )
                return doc(this);


            if(this.attribs.src.match(imageDataUrlRegex))
                return doc(this);

            var src = this.attribs.src;

            // //remove all attributes
            this.attribs= {};
            // //add new attributes
            this.attribs.src = urlTool.relToAbs(uri,src);
            this.attribs.class = "formatted";
            this.attribs.onerror = "this.parentNode.removeChild(this);"
            return doc(this);
        },

        'removeAttr': function () {

            if(doc(this).hasClass('formatted')){
                return doc(this);
            }

            for(var x in badAttrs)
                if(this.attribs[ badAttrs[x] ])
                    doc(this).attr(badAttrs[x],null)

            return doc(this);
        }

    }

    self.do = function(_uri,content,moduleId) {

        doc = cheerio.load('<div class="module-content-wrapper"></div>');
        let contentDomObj = doc(content);

        console.log(moduleId, contentDomObj);

         if(!contentDomObj.length){
             let contentWrapper = cheerio.load('<div class="module-content-wrapper">problem to load content!</div>');
             return contentWrapper('.module-content-wrapper').addClass('error');
         }

        uri = _uri;
        let wrapper = doc('.module-content-wrapper').append(contentDomObj);

        if(uri)
            wrapper.attr('name',uri.hostname)

        if(doc(content).hasClass('formatted')){
            var temp = content[0].attribs;
            content[0].attribs = {};
            for(var x in temp)
                content[0].attribs[x] = temp[x];
        }
         else
             content[0].attribs = {};


         formatImages();
         formatLinks();
         removeBadTags();
         removeBadAttr();

         return wrapper;
    };

    function removeBadAttr() {
        doc('*:not(img,a)').each( function () {
            return formatActionTable['removeAttr'].call(this);
        });
    };

    function formatImages() {

        doc('img').each(function () {
            return formatActionTable.images.call(this);
        })

    };

    function formatLinks() {
        doc('a').map(function(){
            return formatActionTable.links.call(this);
        });
    }

    function removeBadTags() {
        doc('*').each(function () {
            if( isEmptyNode.call(this) || this.name == "script" || this.name == "link" )
                return formatActionTable.badTags.call(this);

            formatActionTable.isLongText.call(this);
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