/**
 * Created by amir on 24/05/16.
 */

var fs = require('fs');
var readJsonSync = require('fs-extra').readJsonSync;
var join = require('path').join;
const walkSync = require('walk-sync');

const ContentModule = require('./browser_module');
const Editor = require('./browser_editor');

const app_root = process.cwd();
const views_dir = join(app_root, "_views");
const modules_dir = join(app_root, "_modules");


class ViewsController{

    constructor(){
        this.all = {};
        this.currentViewId = null
        this.mainViewId = null;
        this.webView = null;
        this.isEditMode = false;
    }

    load(callback) {

        let walkSyncOptions = {
            globs: ['*/profile.json'],
            directories: false
        }

        let viewPaths = walkSync(views_dir,walkSyncOptions);

        for(let x in viewPaths) {
            let view = new View(viewPaths[x]);
            view.loadModules();

            if(view.isMain)
                this.mainViewId = view.id;

            this.all[view.id] = view;
        }

        callback.call(this);
    }

    update(uri,html){

        let expeptionalViewId = Object.keys(this.all).filter((viewId)=>{
            let isMatch = false;
            let view = this.all[viewId];

            if(view.isMain) return false;

            let urlPattern = true;
            let x = 0;
            while(!isMatch && urlPattern){
                urlPattern = view.profile.urls[x];
                isMatch = uri.href.indexOf(urlPattern) !== -1;
                x++;
            }

            return isMatch;
        })[0];

        let nextViewId = expeptionalViewId? expeptionalViewId:this.mainViewId;

        if(nextViewId==this.currentViewId){
            console.log('only update');
            this.updateCurrentView(uri,html)
        }
        else{
            this.currentViewId = nextViewId;
            console.log('change view');
            this.switchView(uri,html)
        }

    }

    setEditMode(){
        let currentView = this.all[this.currentViewId];
        this.isEditMode = true;

        this.editor = new Editor(currentView);
        this.editor.init();
        document.body.appendChild(this.editor.menu.element);
    }

    init(webview){
        this.webView = webview;

        this.each((view)=> {
            view.init();
            webview.appendChild(view.element.wrapper);
        });
    }

    updateCurrentView(uri, html){
        let currentView = this.all[this.currentViewId];
        currentView.show();
        currentView.update(uri, html)
    }

    switchView(uri, html){

        //hide all views
        this.each((view)=> view.hide());

        //show and update the content for nextView
        this.updateCurrentView(uri,html);

    }

    each(callback){
        for(var x in this.all)
            callback(this.all[x])
    }

}


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
    }

    loadModules(){
        for(var i in this.profile.content_modules) {
            let mId = this.profile.content_modules[i];
            this.modules.push(new ContentModule(modules_dir,mId));
        }
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
            this.element.modulesWrapper.appendChild( module.element );
        });
    }

    update(uri,html){
        this.each((module)=> {
            module.update(uri,html);
        });
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

        this.wrapper.id = profile.id;
        this.wrapper.className = "view-wrapper";
        this.wrapper.setAttribute('_title', profile.title);

        this.modulesWrapper.className = 'modules-wrapper';
        this.styleSheet.type = "text/css";
        this.styleSheet.innerText = fs.readFileSync( join(views_dir,profile.id,profile.theme) );

        this.wrapper.appendChild(this.styleSheet);
        this.wrapper.appendChild(this.modulesWrapper);
    }

}


module.exports = ViewsController;


















