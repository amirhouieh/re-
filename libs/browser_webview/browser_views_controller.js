/**
 * Created by amir on 24/05/16.
 */


var join = require('path').join;
const walkSync = require('walk-sync');
const URL = require('url');

const app_root = process.cwd();
const views_dir = join(app_root, "_views");
const ViewClass = require('./browser_viewclass');

class ViewsController{

    constructor(){
        this.all = {};
        this.currentViewId = null
        this.webView = null;
        this.colorList = {}
        this.urls = [];
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

            this.all[view.id] = view;
        }

        if(callback)
            callback.call(this);
    }

    update(uri,html){

        let nextViewId = this.getViewForUrl(uri.href).id;

        if(nextViewId==this.currentViewId){
            console.log('only update');
            this.updateCurrentView(uri,html)
        }
        else{
            this.currentViewId = nextViewId;
            this.switchView(uri,html)
        }

    }

    getViewForUrl(_url){

        if(_url==":home")
            return this.all['v_homepage'];

        let urlObj = URL.parse(_url);
        let view = _.filter(this.all,(view)=>{
            let hasMatch = false;
            let i = 0;
            let pattern = view.urlPatterns[i];

            while(!hasMatch && pattern){
                hasMatch = pattern.url.host == urlObj.hostname
                            &&
                           pattern.pathPattern.match(urlObj.path);

                i++;
                pattern = view.urlPatterns[i];
            }
            return hasMatch;
        });

        return view.length? view[0]:this.all['v_default_view'];
    }

    unsetEditMode(){
        
        if(!this.editor)
            return;

        this.editor.kill();
        this.editor = null;

        //refresh the page
        setTimeout(()=>refresh(),500);
    }

    setEditMode(){
        let currentView = this.all[this.currentViewId];
        const Editor = require('./editor/browser_editor');

        this.editor = new Editor(currentView);
        this.editor.init();
        this.editor.onKill = ()=>this.unsetEditMode();
    }

    init(webview){
        this.webView = webview;
        let homePageColorList = []

        this.each((view)=> {
            view.init();
            this.colorList[view.id] = view.colorTheme;

            _.each(view.colorTheme,(color)=>{
                homePageColorList.push(color);
            })

            webview.appendChild(view.element.wrapper);
        });
        
        this.all['v_homepage'].colorTheme = homePageColorList;
    }


    updateCurrentView(uri, html){
        let currentView = this.all[this.currentViewId];
        currentView.show();
        currentView.update(uri, html);
        setTimeout(()=>currentView.execute.call(currentView),300);
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


















