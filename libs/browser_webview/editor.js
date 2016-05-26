/**
 * Created by amir on 24/05/16.
 */
const _ = require('../utils');
cssPropList = require('../../resources/css_prop_list.json');

console.log(cssPropList)


class Editor{

    constructor(currentView){

        this.view = currentView;
        this.menu = new EditorMenu();

    }

    init(){

        this.view.each((module)=>{
            let handler = new EditHandler(module)
            handler.attachEvents();
        });

        console.log(this.menu.cssProps)

    }
    
}

class EditHandler{

    constructor(module){
        this.handler = document.createElement('div');
        this.handler.className = "edit-handler";
        this.handler.innerHTML = module.profile.title;

        this.wrapper = module.element;
        this.wrapper.setAttribute('selector','editable');
        this.wrapper.appendChild(this.handler);

    }

    attachEvents(){
        const self = this;
        let links =  this.wrapper.getElementsByClassName('link');
        let allNodes =  this.wrapper.querySelectorAll('*');

        //prevent default links on click
        _.eachArr(links,(i,link)=> link.onclick = (e)=> e.preventDefault());

        //show element tagname on hover
        _.eachArr(allNodes, (i,node)=> {
            node.title = "<"+node.tagName.toLowerCase()+">";
            node.onmouseenter = (e)=> self.toggleHighlight.call(node);
            node.onmouseleave = (e)=> self.toggleHighlight.call(node);
        });

        this.wrapper.onmouseenter = (e)=> self.toggle()
        this.wrapper.onmouseleave = (e)=> self.toggle()

    }

    toggleHighlight(node){
        if(this.hasAttribute('selector'))
            this.removeAttribute('selector');
        else
            this.setAttribute('selector','highlighted');
    }


    toggle(){
        this.handler.classList.toggle('visiable');
    }


}

class EditorMenu{

    constructor(){
        this.element = document.createElement('div');
        this.cssProps = this.element.style;
        this.element.className = "editor-menu";
    }


}


module.exports = Editor;


















