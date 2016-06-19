/**
 * Created by amir on 24/05/16.
 */


const ModuleEditor = require('./browser_editor_module_editor');
const _ = require('lodash');
const $ = require( '../../doc-utils' ).doc;

class Canvas{

    constructor(){
        this.modules = {};
        this.resizable = null;
        this.draggable = null;
        this.currentMudleId = null;
        this.somthingIsSelected = false;
        this.firstTime = true;
    }

    init(view){
        view.each((module)=>{
            let editor = new ModuleEditor(module);
            editor.init();
            this.modules[module.id] = editor;
        });
    }

    select(moduleId,callback){

        if(moduleId==this.currentMudleId) {
            this.resetAll();
            return;
        }

        if(this.somthingIsSelected){
            this.resetAll();
        }

        this.currentMudleId = moduleId;
        this.resizable = new $.resizable( this.getCurrentModule().wrapper );
        this.draggable = new $.draggable(this.getCurrentModule().wrapper);

        this.resizable.onresize = (w,h)=> callback(w,h);
        this.draggable.ondrag = (w,h)=> callback(w,h);
        this.somthingIsSelected = true;

        this.highlight();
    }

    highlight(){
        this.getCurrentModule().highlight();
    }

    getCurrentModule(){
        return this.modules[this.currentMudleId];
    }
    
    resetAll(){

        if(!this.resizable && !this.draggable)
            return;

        this.resizable = this.resizable.kill();
        this.draggable = this.draggable.kill();
        this.currentMudleId = null;
        _.each( this.modules,(me)=> me.unhighlight() );

    }

}

module.exports = Canvas;


















