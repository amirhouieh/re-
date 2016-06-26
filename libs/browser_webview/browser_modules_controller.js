/**
 * Created by amir on 24/05/16.
 */

var fs = require('fs');
var path = require('path');
const walkSync = require('walk-sync');
const _ = require('lodash');

const ContentModule = require('./browser_moduleclass');

const app_root = process.cwd();
const modules_dir = path.join(app_root, "_modules");

class ModulesController{

    constructor(){
        this.all = [];
    }

    loadAll(callback) {

        const self = this;

        let walkSyncOptions = {
            globs: ['*/profile.json'],
            directories: false
        }

        let modulesPaths = walkSync(modules_dir,walkSyncOptions);

        this.all = modulesPaths.map(
            (modulesPath)=> self.loadOne(path.dirname(modulesPath))
        )

        if(callback)
            callback.call(this);
    }

    getIcons(view){
        let icons = _.groupBy(this.all,(module)=> view.hasModule(module.id) );

        icons.true = icons.true.map((module)=>module.getIconElement());
        icons.false = icons.false.map((module)=>module.getIconElement());
        
        return icons
    }



    loadOne(mId){
        let module = new ContentModule(mId);
        return module;
    }

    each(callback){
        for(var x in this.all)
            callback(this.all[x])
    }

}



module.exports = ModulesController;


















