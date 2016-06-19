/**
 * Created by amir on 24/05/16.
 */

const _ = require('lodash');
const ModuleController = require('../../browser_modules_controller');
const PageSuperClass = require('./page_superclass');

const mc = new ModuleController();
mc.loadAll();

class EditorMenuContent extends PageSuperClass{

    constructor() {
        super("content.html");
    }

    init(currentView){
        this.icons = mc.getIcons(currentView);
        this.addModulesIcons();
    }

    update(){
        return false;
    }

    addModulesIcons(){
        let activeGallery = this.html.find('#active');
        let restGallery = this.html.find('#rest');

        _.each(this.icons.true,(icon)=> activeGallery.appendChild(icon.element));
        _.each(this.icons.false,(icon)=> restGallery.appendChild(icon.element));
    }
}


module.exports = EditorMenuContent;


















