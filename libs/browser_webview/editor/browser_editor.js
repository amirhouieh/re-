/**
 * Created by amir on 24/05/16.
 */

const EditorMenu = require('./browser_editor_menu');
const EditorCanvas = require('./browser_editor_canvas');
const _ = require('lodash');

const SelectorTypes = {
    ID: 'id',
    CLASSNAME: 'classname',
    TAGNAME: 'tagname',
    UNIQUE: 'unique'
}

class Editor{

    constructor(currentView,_theme){
        this.view = currentView;
        this.theme = _theme;
        this.menu = new EditorMenu();
        this.canvas = new EditorCanvas();

        this.currentModule = 0;

    }

    init(){
        let self = this;

        this.menu.init(this.view);
        this.canvas.init(this.view);

        this.appendMenu();
        this.setModuleAsSelectedElement();
        this.attachEvents();
    }

    appendMenu(){
        this.view.element.wrapper.parentElement
                .appendChild( this.menu.html.element );
    }

    attachEvents(){
        let editor = this;


        _.each(this.menu.pages,(page)=>
            page.onChange = (props)=> editor.onChange(props)
        );

        _.each(editor.view.modules,(module,index)=>{

            module.element.onclick = (e)=> {

                if(this.canvas.draggable||this.canvas.resizable)
                    return;

                editor.currentModule = module;
                editor.menu.pages.DESIGN.update(e.target);
            }

        });

        _.each(this.menu.pages.DESIGN.moduleHandlers,(moduleSelector)=>

            moduleSelector.onclick = (e)=>{

                let module = editor.view.modules.filter((module)=>
                    module.id==moduleSelector.id
                )[0];

                this.resizable = true;
                this.draggable = true;

                this.canvas.select(module.id,(...args)=>{
                    this.menu.pages.DESIGN.updateFields();
                });
                
                editor.setModuleAsSelectedElement(module);
            }
        )

    }

    setModuleAsSelectedElement(module){
        this.currentModule = module||this.view.modules[0];
        this.menu.pages.DESIGN.update(this.currentModule.element, SelectorTypes.ID);
    }

    onChange(cssProp){
        
        let selectedNodes = this.getApplicableNodes();

        if(!selectedNodes.length)
            selectedNodes = [this.currentModule.element]

        _.each(selectedNodes,(node)=> this.applyCss(node,cssProp));
    }

    applyCss(node,cssProp){
        node.style[cssProp.name] = cssProp.value;
    }

    getApplicableNodes(){
        return this.currentModule.element.querySelectorAll(this.menu.pages.DESIGN.querySelector);
    }

}

module.exports = Editor;


















