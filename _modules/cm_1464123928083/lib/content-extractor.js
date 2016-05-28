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
            console.log('it is textual page');
            return textualPageContent;
        }
        else{
            //might be image based content
            var imageBasedContent = extractVisualPage();

            if( imageBasedContent ) {
                console.log('visual page');
                return imageBasedContent;
            }
            else {
                console.log('try for metadata');
                let metadata = self.metadata();

                if(metadata)
                    return metadata;

                return 'has nothing';
            }
        }
    }

    //only text module
    self.searchInput = function () {
        let form= doc('<form>');
        let input = doc('<input>');

        input.attr({
            'name': urlSet.searchEngine.name + " search ...",
            'class': 'formatted',
            'type': 'text',
            'value': urlSet.searchEngine.name + " search ...",
        })

        form.attr({
            class: 'formatted',
            href:  urlSet.searchEngine['search-query']

    });

        return form.append(input);
    };

    //only text module
    self.searchResult = function () {
        var content = extractISearchItems();

        if(content.length)
            return content;
        else
            return 'unable to find the content!'
    };

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

    function extractISearchItems() {
        //doc(selector).map does not work?!
        var items = [];
        var selector = getSelector();

        if(selector) {

            doc(selector).each(function () {
                let classname = "search-item";
                if( doc(this).find('a').length >= 6 )
                    classname += " topRes";
                items.push(wrap(this, '<li>', classname));

            })

            if(items.length)
                return wrap(items, '<ul>');
            return [];
        }

        //default for other search pages such as wikipedia or ted.com
        //assume they mostly wrapp search results in <li>

        var res = doc('li').filter(function () {
            return getNodeNetText.call(this).length >= 100 && isNavigationWrapper(this);
        }).parent('ul');

        return res;

    }

    //utils
    function getSelector() {

        if( urlSet.searchEngine && urlSet.searchEngine['item-selector'] )
            return urlSet.searchEngine['item-selector'];

        if( urlSet.itemSelector )
            return urlSet.itemSelector;

        else
            return null;

    };
    function findImgWrapper(node){

        var netText = getNodeNetText.call(node);

        if(netText.length>=10){

            if( netText.length <= 500 && node.name !== "body"){
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

