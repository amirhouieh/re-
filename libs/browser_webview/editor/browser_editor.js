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

    constructor(currentView){
        this.view = currentView;
        this.menu = new EditorMenu();
        this.canvas = new EditorCanvas();
        this.currentModule = 0;
        this.isSet = true;
        this.onKill = null;
    }

    init(){
        let self = this;

        this.appendMenu();
        this.menu.init(this.view);
        this.canvas.init(this.view);

        this.setModuleAsSelectedElement();
        this.attachEvents();
    }

    update(view){
        this.view = view;
        this.menu.update(this.view);
        this.canvas.update(this.view);
    }

    kill(){

        if(!this.isSet)
            return;

        this.menu.kill();
        this.canvas.kill();
        this.isSet = false;
        this.onKill();
    }

    appendMenu(){
        document.body
                .appendChild( this.menu.html.element );
    }

    attachEvents(){
        let editor = this;

        _.each(this.menu.pages,(page)=>
            page.onChange = (props)=> editor.onChange(props)
        );

        this.menu.resetBtn.onclick = (e)=> this.reset();
        this.menu.saveBtn.onclick = (e)=>this.save();
        this.menu.closeBtn.onclick = (e)=>this.kill();

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

    reset(){
        this.canvas.reset();
        this.menu.pages.DESIGN.reset();
    }

    save(){
        let costumeStyle = this.menu.pages.DESIGN.getCssRules();

        if(!costumeStyle)
            return;

        this.menu.loading();
        this.view.updateTheme(costumeStyle,(err)=>{

            if(err) return console.log(err);

            setTimeout(()=>{
                this.menu.stopLoading();
            }, 1000);

        });
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


















