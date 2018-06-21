/**
 * Created by amir on 16/05/16.
 */

const digitMatchRegex = /\d+/;


class RefHandler{

    constructor(refElem){
        this.original = refElem;
        this.elem = document.createElement('div');
        this.update(refElem);
    }

    init(){
        this.updateTop();
        this.elem.className = 'refHandler-wrapper';
        this.elem.onmouseover = (e)=> this.toggleRefText('add');
        this.elem.onmouseout = (e)=> this.toggleRefText('remove');
    }

    update(refElem){
        let handlerClone = refElem.cloneNode(true);

        let refNumber = handlerClone.innerText.match(digitMatchRegex);

        if(refNumber)
            handlerClone.innerText = refNumber[0]

        this.elem.appendChild(handlerClone);
    }

    updateTop(){
        this.elem.style.top = (this.original.offsetTop+7)+'px';
    }

    toggleRefText(whatToDo){
        let target = this.original.parentNode;
        let highlightText = "";

        while(target.tagName === "SUP"){
            target = target.previousSibling;
        }

        while(target && target.textContent && target.tagName !== "SUP" && target.tagName!== 'P'){
            let nodeContent = target.textContent||'';

            target.classList[whatToDo]('highlightText');
            highlightText = nodeContent+highlightText;
            target = target.previousSibling;

            if(nodeContent.indexOf('. ')>-1) break;
        }
    }

}

module.exports = function() {

    
    let allrefs = document.querySelectorAll('a.reflink');
    let sidebar = document.createElement('div');
    let closeHandler = document.createElement('span');
    let handlers = [];
    let refModule = this.getModule('cm_wiki_notes_references');
    let textModule = this.getModule('cm_wiki_maintext');
    let LinkPreview = require('../../libs/browser_ui/browser_hyperlink_preview');

    let allRefsText = refModule.element.querySelectorAll('li');
    let isRefWrapperOn = false;
    
    let linkPreview = new LinkPreview();
    textModule.element.appendChild(linkPreview.html.element);
    linkPreview.init();
    linkPreview.hide();

    let _ = require('lodash');
    sidebar.id = "sidebar";
    closeHandler.className = "closeHandler";
    closeHandler.innerText = "x";

    textModule.element.appendChild(sidebar);
    refModule.element.appendChild(closeHandler);

    // nodeContent.match(/[.]\s|[,]\s|\s["]]/)

    let handler = null;

    let showRefWrapper = ()=>{
        isRefWrapperOn = true;
        refModule.element.classList.add('show');
    }

    let hideRefWrapper = ()=>{
        isRefWrapperOn = false;
        refModule.element.classList.remove('show');
    }

    let showRefText = (e)=>{
        let href = e.target.getAttribute('_href');
        href = href.replace('#','');
        showRefWrapper();

        let hrefElem = _.each(allRefsText,(li)=>{
           if(li.id==href)
               li.className = "";
           else
               li.className = "hide";
        });
    }
    
    _.each(allrefs,(ref)=>{

        let next = ref.parentNode.nextSibling||{tagName:null};

        if(!handler){
            handler = new RefHandler(ref);
            handler.init();
            handler.elem.onclick = (e)=> showRefText(e);
            handlers.push(handler);
            sidebar.appendChild(handler.elem);
        }else{
            handler.update(ref);
        }

        if(next.tagName!=="SUP"){
            handler = null;
        }
    });


    _.each(document.querySelectorAll('a.link'),(link)=>{
        link.onmouseover = (e)=>linkPreview.getSniff(e);
        link.onmouseout =  (e)=>linkPreview.hide()
    })

    closeHandler.onclick = (e)=> hideRefWrapper();

    window.onresize = (e)=>
        _.each(handlers,(handler)=>handler.updateTop());

    return this;
}