/**
 * Created by amir on 24/05/16.
 */
const _ = require('../utils');
cssPropList = require('../../resources/css_prop_list.json');

class Editor{

    constructor(currentView){

        this.view = currentView;
        this.menu = new EditorMenu();
        this.jquery = null;


    }

    init(){

        // window.jQuery = window.$ = require('../jquery-2.1.0.min');
        // require('../jquery-ui.min');

        this.view.each((module)=>{
            let handler = new EditHandler(module)
            handler.attachEvents();
            this.menu.attachEvents();
        });


    }
    
}

class EditHandler{

    constructor(module){
        this.titleBar = document.createElement('div');
        this.titleBar.className = "edit-handler";
        this.titleBar.innerHTML = module.profile.title;

        this.resizeHandler = document.createElement('div');
        this.resizeHandler.className = "resizer";


        this.wrapper = module.element;
        this.wrapper.setAttribute('selector','editable');


        this.wrapper.className += ' resizable';

        this.resizeHandlerX = null;
        this.resizeHandlerY = null;
        this.startWidth = null;
        this.startHeight = null;
        this.dragHandlerX = 0;
        this.dragHandlerY = 0;
        this.startX = null;
        this.startY = null;

        this.width = null;
        this.height = null;

        this.isResizeAble = false;
        this.draggAble = false;

        this.wrapper.appendChild(this.resizeHandler);
        this.wrapper.appendChild(this.titleBar);

    }

    attachEvents(){
        const self = this;
        let links =  this.wrapper.getElementsByClassName('link');
        let allNodes =  this.wrapper.querySelectorAll('*');


        //make it resizable
        let inlineStyle = this.wrapper.getAttribute('style') || '';
        if(!inlineStyle.length && inlineStyle.indexOf('height') == -1 ) {
            this.wrapper.style.maxHeight = window.innerHeight - 30 + "px";
        }

        this.onResize();

        //prevent default links on click
        _.eachArr(links,(i,link)=> link.onclick = (e)=> e.preventDefault());

        //show element tagname on hover
        _.eachArr(allNodes, (i,node)=> {
            node.title = "<"+node.tagName.toLowerCase()+">";
            node.onmouseenter = (e)=> self.toggleHighlight.call(node);
            node.onmouseleave = (e)=> self.toggleHighlight.call(node);
        });

        this.wrapper.onmouseenter = (e)=> self.toggleTitle()
        this.wrapper.onmouseleave = (e)=> self.toggleTitle()
        this.resizeHandler.onmousedown =  (e)=> self.initResize.call(self,e);

        this.titleBar.onmousedown =  (e)=> self.initDrag.call(self,e);
        this.titleBar.onmousemove = (e)=> self.drag.call(self,e);
        this.titleBar.onmouseup = (e)=> self.stopDrag.call(self,e);
    }

    toggleHighlight(node){
        if(this.hasAttribute('selector'))
            this.removeAttribute('selector');
        else
            this.setAttribute('selector','highlighted');
    }


    toggleTitle(){
        this.titleBar.classList.toggle('visiable');
    }
    
    initDrag(){
        this.draggAble = true;
        this.startX = this.dragHandlerX - this.wrapper.offsetLeft;
        this.startY = this.dragHandlerY - this.wrapper.offsetTop;
    }

    drag(e) {
        this.dragHandlerX = e.clientX;
        this.dragHandlerY = e.clientY;

        let left = this.dragHandlerX - this.startX;
        let top = this.dragHandlerY - this.startY;

        if (this.draggAble) {

            if(left+this.width>=window.innerWidth) {
                this.resizeHandler.style.left = 0;
                this.resizeHandler.style.removeProperty('right')
            }else if( left<=0 || left+this.width<window.innerWidth){
                console.log('handler to right')
                this.resizeHandler.style.right = 0;
                this.resizeHandler.style.removeProperty('left')
            }

            if(top+this.height>=window.innerHeight) {
                this.resizeHandler.style.top = 0;
                this.resizeHandler.style.removeProperty('bottom')
            }else if(top<=0 || top+this.height<window.innerHeight){
                this.resizeHandler.style.bottom = 0;
                this.resizeHandler.style.removeProperty('top')
            }


            this.wrapper.style.left = left + 'px';
            this.wrapper.style.top = top + 'px';
        }

    }

    stopDrag() {
        this.draggAble = false;
    }


    initResize(e){

        let self = this;

        this.isResizeAble = true;

        this.resizeHandlerX = e.clientX;
        this.resizeHandlerY = e.clientY;
        this.startWidth = parseInt(document.defaultView.getComputedStyle(self.wrapper).width, 10);
        this.startHeight = parseInt(document.defaultView.getComputedStyle(self.wrapper).height, 10);

        document.documentElement.onmousemove = (e)=>self.resize.call(self,e);
        document.documentElement.onmouseup = (e)=>self.stopResize.call(self,e);

    }

    stopResize(e) {

        let self = this;
        this.isResizeAble = false;
    }

    resize(e){

        if(!this.isResizeAble)
            return;

        this.wrapper.style.width = (this.startWidth + e.clientX - this.resizeHandlerX) + 'px';
        this.wrapper.style.height = (this.startHeight + e.clientY - this.resizeHandlerY) + 'px';

        this.onResize();
    }

    onResize(){
        this.width = this.wrapper.offsetWidth;
        this.height = this.wrapper.offsetHeight;
    }



}

class EditorMenu{

    constructor(){
        this.element = document.createElement('div');
        this.closeBtn = document.createElement('button');

        this.closeBtn.className = "menu-close-btn";
        this.closeBtn.innerHTML = "&#x2716;";
        this.element.className = "editor-menu";

        this.cssProps = this.element.style;

        this.element.appendChild(this.closeBtn);
    }

    attachEvents(){
        this.closeBtn.onclick = (e)=> this.toggle()
        this.toggle()
    }

    toggle(){

        if( this.element.classList.toggle("expended") ){
            this.closeBtn.innerHTML = "&#x2716;";
        }else{
            this.closeBtn.innerHTML = "&#x21A9;";
        }

    }

}




module.exports = Editor;


















