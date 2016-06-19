/**
 * Created by amir on 24/05/16.
 */

const fse = require('fs-extra');
const join = require('path').join;
const Formatter = require('./content-formatter')();

const app_root = process.cwd();
const modules_dir = join(app_root, "_modules");
const menu_components_dir = join(app_root,"html_components/editor");


class ContentModuleObj{

    constructor(moduleId){

        this.path = join(modules_dir, moduleId);
        this.id = moduleId;
        this.profile = fse.readJsonSync(join(this.path,'profile.json'), {throw: false});
        this.element = newModuleWrapper(this.id);
        this.script = require(join(this.path,this.profile.script));
        
    }

    update(uri, html, callback){
        this.element.innerHTML = Formatter.do( uri,this.script(uri, html) );
    }
    
    getIconElement(){

        let TEMPLATE = require( '../html-template-engine' );
        let pathToModuleTemplate = join(menu_components_dir, 'module-icon.html');
        let elem = new TEMPLATE().createFromPath(pathToModuleTemplate, this.profile);

        let iconImage = elem.find('.iconImage');

        // elem.find('img').src = join(this.path, this.profile.icon);
        iconImage.style.backgroundImage = 'url(' +  join(this.path, this.profile.icon) + ')';
        iconImage.style.borderColor = this.profile.color;
        iconImage.style.backgroundColor = this.profile.color;
        elem.element.id = this.id;

        return elem;
    }
    
}

function newModuleWrapper(id) {
    let wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.className = "module-wrapper";
    return wrapper;
}

module.exports = ContentModuleObj;
