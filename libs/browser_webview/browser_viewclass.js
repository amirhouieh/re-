/**
 * Created by amir on 24/05/16.
 */

const join = require('path').join;
const {readFileSync,writeFile,writeFileSync} = require('fs');
const readJsonSync = require('fs-extra').readJsonSync;
const _ = require('lodash');

const app_root = process.cwd();
const views_dir = join(app_root, "_views");

class View{

    constructor(_path){
        let id = _path.substring(0, _path.lastIndexOf("/"));
        let viewAbsPath = join( views_dir, _path);

        this.id = id;
        this.dir = join(views_dir,id);
        this.profile = readJsonSync(viewAbsPath, {throw: false});
        this.modules = [];
        this.isMain = typeof this.profile.urls == "string" && this.profile.urls.trim().length == 0;
        this.element = new ViewElement(this.profile);
        this.colorTheme = [];
        this.execute = require(join(views_dir,this.profile.id,this.profile.script));
    }

    loadModules(){

        let ModulesController = require('./browser_modules_controller');
        let mc = new ModulesController();

        this.modules = this.profile.content_modules.map(
            (moduleId)=> mc.loadOne(moduleId)
        );
    }

    deactivate(){
        this.profile.active = false;
        writeFileSync(join(this.dir,'profile.json'), JSON.stringify(this.profile));
    }

    updateTheme(costumeCss,callback){

        let {jsonToCss} = require(join(app_root,'libs/doc-utils'));
        let cssQuery = jsonToCss(costumeCss);
        let themeFilePath = join(views_dir, this.profile.id, this.profile.theme);

        let themeFile = readFileSync(themeFilePath, 'utf8');

        themeFile += cssQuery;
        writeFile(themeFilePath, themeFile, 'utf8',(err)=>{
            this.element.styleSheet.innerText = themeFile;
            callback(err);
        });

    }

    hide(){
        this.element.wrapper.style.display = "none";
    }

    show(){
        this.element.wrapper.style.display = "block";
    }

    init(){
        this.hide();
        this.each((module)=> {
            this.colorTheme.push(module.profile.color);
            this.element.modulesWrapper.appendChild( module.element );
        });


        if(this.colorTheme.length==1){
            this.colorTheme.push('rgb(100,100,100)');
        }

    }

    update(uri,html){

        let errorNumbers = 0;

        this.each((module)=> {
            module.update(uri,html);
            if(module.error)
                errorNumbers++;
        });

        if(errorNumbers==this.modules.length) {
            this.element.errorElem.classList.add('show');
            this.element.modulesWrapper.classList.add('hide');
        }else{
            this.element.errorElem.classList.remove('show');
            this.element.modulesWrapper.classList.remove('hide');
        }

    }

    hasModule(moduleId){
        return this.modules.filter((module)=> module.id == moduleId).length > 0;
    }

    getInfoElem(){
        let TEMPLATE = require( '../html-template-engine' );
        let viewInfoTemplatePath = join(app_root,'html_components/editor', 'view-info-element.html');
        let elem = new TEMPLATE().createFromPath(viewInfoTemplatePath, this.profile);
        return elem;
    }

    getModule(mId){
        if(!mId)
            return this.modules;

        return this.modules.filter((m)=>m.id==mId)[0];
    }

    each(callback){
        for(var x in this.modules)
            callback(this.modules[x]);
    }

}
class ViewElement{

    constructor(profile){

        this.wrapper = document.createElement('section');
        this.styleSheet = document.createElement('style');
        this.modulesWrapper = document.createElement('div');
        this.errorElem = document.createElement('div');
        // this.script = document.createElement('script');

        this.errorElem.className = "unable-view"
        this.errorElem.innerHTML = "<h3>Sorry, all the module in current view are unable to extract the content!</h3>"

        this.wrapper.id = profile.id;
        this.wrapper.className = "view-wrapper";
        this.wrapper.setAttribute('_title', profile.title);
        this.wrapper.setAttribute('unique-css-selector', '.' + this.wrapper.className + '#'+ this.wrapper.id);
        this.modulesWrapper.className = 'modules-wrapper';
        this.styleSheet.type = "text/css";
        this.styleSheet.innerText = readFileSync( join(views_dir,profile.id,profile.theme) );

        // this.wrapper.appendChild(this.script);
        this.wrapper.appendChild(this.styleSheet);
        this.wrapper.appendChild(this.modulesWrapper);
        this.wrapper.appendChild(this.errorElem);

    }

}

module.exports = View;
