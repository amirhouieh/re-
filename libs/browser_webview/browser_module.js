/**
 * Created by amir on 24/05/16.
 */

const fse = require('fs-extra');
const path = require('path');
const Formatter = require('./content-formatter')();

class ContentModule{

    constructor(modules_dir,moduleId){
        
        let modulePath = path.join(modules_dir, moduleId);
        this.id = moduleId;
        this.profile = fse.readJsonSync(path.join(modulePath,'profile.json'), {throw: false});
        this.element = newModuleWrapper(this.id);
        this.script = require(path.join(modulePath,this.profile.script));
    }

    update(uri, html){
        this.element.innerHTML = Formatter.do(uri,this.script(uri, html));
    }

}

function newModuleWrapper(id) {
    let wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.className = "module-wrapper";
    return wrapper;
}

module.exports = ContentModule;