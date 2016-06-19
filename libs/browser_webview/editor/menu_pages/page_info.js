/**
 * Created by amir on 24/05/16.
 */

const _ = require('lodash');
const PageSuperClass = require('./page_superclass');

class EditorMenuContent extends PageSuperClass{

    constructor() {
        super("info.html");
    }

    init(currentView){
        this.html.element.appendChild(currentView.getInfoElem().element);
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


















