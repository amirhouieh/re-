/**
 * Created by amir on 24/05/16.
 */

const join = require('path').join;
const _ = require('lodash');

const $ = require( '../../doc-utils' ).doc;
const Template_Engine = require( '../../html-template-engine' );

const app_root = process.cwd();
const menu_components_dir = join(app_root,"html_components/editor");

const DesignPageClass =  require('./menu_pages/page_design');
const ContentPageClass = require('./menu_pages/page_content');
const InfoPageClass =    require('./menu_pages/page_info');

class EditorMenu{

    constructor() {
        let pathToMenuTemplate = join(menu_components_dir, 'menu.html');
        this.html = new Template_Engine().createFromPath(pathToMenuTemplate)

        this.closeBtn = this.html.find('#close');
        this.resetBtn= this.html.find('#reset');
        this.saveBtn= this.html.find('#save');
        
        this.pageHandlers = this.html.findAll('.page-handler');
        this.pages = {};

        this.pages.DESIGN = new DesignPageClass();
        this.pages.CONTENT = new ContentPageClass();
        this.pages.INFO = new InfoPageClass();

        this.onChange = null;
    }

    init(view){

        this.pages.INFO.init(view);
        this.pages.DESIGN.init(view);
        this.pages.CONTENT.init(view);

        this.appendComponents()
        this.attachEvents();

        setTimeout(()=>this.stopLoading(), 1000);
    }

    update(view){
        this.pages.INFO.update(view);
        this.pages.DESIGN.updateView(view);
        this.pages.CONTENT.init(view);
        this.setBackgroundColor(view);
    }
    
    kill(){
        this.toggle();
        _.each(this.pages,(page)=> page.hide());
        setTimeout(()=>this.html.remove(),520);
    }

    loading(){
        this.html.element.classList.add('gradientAnimate');
    }

    stopLoading(){
        this.html.element.classList.remove('gradientAnimate');
    }

    setBackgroundColor(view){
        this.html.element.style.background = buildGradientQuery(view.colorTheme);
    }

    appendComponents(){
        let pagesWrapper = this.html.find('#controllers-wrapper');

        pagesWrapper.appendChild( this.pages.INFO.html.element );
        pagesWrapper.appendChild( this.pages.DESIGN.html.element );
        pagesWrapper.appendChild( this.pages.CONTENT.html.element );
    }

    attachEvents() {

        // this.toggleBtn.onclick = (e)=> this.toggle();
        _.each(this.pageHandlers, (handler)=>
            handler.onclick = (e)=>
                this.switchPages(e)
        );
    }


    switchPages(e){

        if(e.target.className.indexOf('selected')!==-1)
            return;

        this.highlight();

        let thisPageSelector = e.target.getAttribute('page-selector');
        let thisPage = this.pages[ thisPageSelector ];

        _.each(this.pageHandlers,(handler)=> $.removeClass(handler,'selected'));
        _.each(this.pages,(page)=> page.hide());

        $.addClass(e.target,'selected');
        thisPage.show();

    }

    toggle(){
        // this.highlight();
        $.toggleClass(this.html.element,"extended");
    }

    highlight(){
        this.loading();
        setTimeout(()=>this.stopLoading(),1000);
    }

}


const buildGradientQuery = (colors)=>{
    return 'linear-gradient(to right,'+ colors.join(',') +') 0% 0% / 200% 100%';
}

module.exports = EditorMenu;


















