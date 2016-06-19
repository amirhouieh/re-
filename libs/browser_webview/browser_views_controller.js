/**
 * Created by amir on 24/05/16.
 */


var join = require('path').join;
const walkSync = require('walk-sync');

const app_root = process.cwd();
const views_dir = join(app_root, "_views");
const ViewClass = require('./browser_viewclass');

class ViewsController{

    constructor(){
        this.all = {};
        this.currentViewId = null
        this.mainViewId = null;
        this.webView = null;
        this.colorList = {}
        this.isEditMode = false;
    }

    load(callback) {

        let walkSyncOptions = {
            globs: ['*/profile.json'],
            directories: false
        }

        let viewPaths = walkSync(views_dir,walkSyncOptions);

        for(let x in viewPaths) {
            let view = new ViewClass(viewPaths[x]);

            if(!view.profile.active)
                continue;
            
            view.loadModules();

            if(view.isMain)
                this.mainViewId = view.id;
            

            this.all[view.id] = view;
        }

        if(callback)
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
            this.switchView(uri,html)
        }

    }

    setHomePage(){
        this.currentViewId = "v_homepage";
        this.updateCurrentView();
    }

    setEditMode(){
        let currentView = this.all[this.currentViewId];
        this.isEditMode = true;

        const Editor = require('./editor/browser_editor');

        this.editor = new Editor(currentView);
        this.editor.init();
    }

    init(webview){
        this.webView = webview;

        this.each((view)=> {
            view.init();
            this.colorList[view.id] = view.colorTheme;
            webview.appendChild(view.element.wrapper);
        });
        
    }

    updateCurrentView(uri, html){
        let currentView = this.all[this.currentViewId];
        currentView.show();
        currentView.update(uri, html);
        setTimeout(()=>currentView.execute.call(currentView),1000);
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


module.exports = ViewsController;


















