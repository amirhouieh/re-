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
        this.all = new EditorCanvas();
        this.currentModule = 0;
        this.isSet = true;
        this.onKill = null;
    }

    init(){
        let self = this;

        this.appendMenu();


        this.menu.setBackgroundColor(this.view);

        setTimeout(()=>{
            this.menu.toggle();
            this.menu.loading();
        },10);

        setTimeout(()=>{
            this.all.init(this.view);
            this.menu.init(this.view);
            this.setModuleAsSelectedElement();
            this.attachEvents();
        },1000);

    }

    update(view){
        this.view = view;
        this.menu.update(this.view);
        this.all.update(this.view);
    }

    kill(){

        if(!this.isSet)
            return;

        this.menu.kill();
        this.all.kill();
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

                if(this.all.draggable||this.all.resizable)
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

                this.all.select(module.id,(...args)=>{
                    this.menu.pages.DESIGN.updateFields();
                });
                
                editor.setModuleAsSelectedElement(module);
            }
        )

    }

    reset(){
        this.all.reset();
        this.menu.pages.DESIGN.reset();
    }

    save(){
        let costumeStyle = this.menu.pages.DESIGN.getCssRules();

        console.log('save', costumeStyle)

        if(!costumeStyle)
            return;

        this.menu.loading();
        this.view.updateTheme(costumeStyle,(err)=>{
            if(err) return alert('saving process faild!');

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


















