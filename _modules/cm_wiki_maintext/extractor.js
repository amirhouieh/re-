/**
 * Created by amir on 16/05/16.
 */

module.exports = function (uri, rawHtml) {

    const cheerio = require('cheerio');
    const doc = cheerio.load(rawHtml);
    let badTags = ['.note','.thumb','.reflist','.navbox','.hatnote','#toc','.infobox','.metadata','.vertical-navbox', '.shortcutbox','dl'];
    let excludeBadTagsQuery = '>*:not('+badTags.join(',')+')';
    let tagsToFilter = ['*.mw-editsection','>*:last-child','*#references','*.references', '#toc','.infobox','.nowraplinks', '#coordinates'];
    let tagsToFilterQuery = tagsToFilter.join(',');
    let headLinesToFilter = ['references','external links','see also','accounting terms','notes','notes and references', 'further reading','subtopics','bibliography'];

    let mainContent = doc('.mw-parser-output').find(excludeBadTagsQuery);
    // let seeAlsoTitle = mainContent.find('#See_also').parent();
    // let seeAlsoContent = seeAlsoTitle.next();

    let ignoreRest = false;


    function newChapter() {
        return doc('<chapter>').addClass('chapter')
    }

    let content = doc('<div>');
    let chapter = newChapter();
    let titleHead = doc('<h2>').addClass('mw-headline').text( doc('title').text().split('-')[0].trim() );

    content.append(chapter.append(titleHead));

    let elem = true;
    let elemCount = 0;

    while(elem){
        elem = mainContent[elemCount];
        if(elem&&elem.name=="h2"){
            chapter = null;
            chapter = newChapter();
            content.append(chapter);
        }

        chapter.append(elem);
        elemCount++;
    }


    content.find(tagsToFilterQuery).each((i,elem)=>{
        doc(elem).remove();
    })

    content.find('sup>a').each((i,elem)=>{
        elem.attribs['_href'] = elem.attribs.href;
        elem.attribs.href = "javascript:;";
        doc(elem).addClass('formatted');
        doc(elem).addClass('reflink');
    });

    content.find('.mw-headline').each((i,elem)=>{
        let titleText =  doc(elem).text().toLowerCase().trim();
        if(headLinesToFilter.indexOf(titleText)>-1) {
            let header = doc(elem).parent();
            header.next().remove();
            header.remove();
        }
    })

    content.find('p').each((i,p)=>{

        if(doc(p).text().length>100)
            doc(p).addClass('longtext');

        doc(p).contents()
            .filter(function(){return this.nodeType === 3})
            .wrap('<span class="textnode"/>');

    })


    content.find('ul').each((i,ul)=>{
        doc(ul).find('>li').each((l,li)=> {

            doc(li).contents()
                .filter(function () {
                    return this.nodeType === 3
                })
                .wrap('<span class="textnode"/>');
        });
        
    })

    return content;
}