/**
 * Created by amir on 24/05/16.
 */

const _ = require('lodash');

class ModuleEditor{

    constructor(module){
        this.profile = module.profile;
        this.wrapper = module.element;
        this.contentWrapper = module.element.querySelectorAll('.module-content-wrapper')[0]
        this.color = module.profile.color;
    }

    setCss(){
        let inlineStyle = this.wrapper.getAttribute('style') || '';
        if(!inlineStyle.length && inlineStyle.indexOf('height') == -1 ) {
            this.wrapper.style.maxHeight = window.innerHeight - 30 + "px";
        }
    }

    attachEvents(){
        const self = this;

        let links =  this.contentWrapper.querySelectorAll('.link');
        let allNodes =  this.contentWrapper.querySelectorAll('*');

        //prevent default links on click
        _.each(links,(link)=> link.onclick = (e)=> e.preventDefault());

        //show element tagname on hover
        _.each(allNodes, (node)=> {
            node.title = "<"+node.tagName.toLowerCase()+">";
            node.onmouseenter = (e)=> self.highlightNode(node);
            node.onmouseleave = (e)=> self.unHighlightNode(node);
        });
    }

    init(){
        this.setCss();
        this.attachEvents();
    }

    highlightNode(node){
        let allHighlighted = this.wrapper.querySelectorAll('*[selector=highlighted]')

        _.each(allHighlighted, (elem)=> elem.removeAttribute('selector') );
        node.setAttribute('selector','highlighted');
    }

    unHighlightNode(node){
        node.removeAttribute('selector');
    }

    highlight(){
        this.wrapper.style.boxShadow = "0px 0px 0px 4px " +  this.color;
    }
    unhighlight(){
        this.wrapper.style.removeProperty('box-shadow');
        this.wrapper.classList.remove('.resizable');
        this.wrapper.classList.remove('.draggable');
    }

}

module.exports = ModuleEditor;


















