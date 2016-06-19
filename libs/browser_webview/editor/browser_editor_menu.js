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

        this.toggleBtn = this.html.find('#menu-close-btn');
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

        this.appendComponents();
        this.setAttribiutes();
        this.attachEvents();
    }

    appendComponents(){
        let pagesWrapper = this.html.find('#controllers-wrapper');

        pagesWrapper.appendChild( this.pages.DESIGN.html.element );
        pagesWrapper.appendChild( this.pages.CONTENT.html.element );
    }

    attachEvents() {

        this.toggleBtn.onclick = (e)=> this.toggle();

        _.each(this.pageHandlers, (handler)=>
            handler.onclick = (e)=>
                this.switchPages(e)
        );
        
    }


    switchPages(e){

        if(e.target.className.indexOf('selected')!==-1)
            return;

        let thisPageSelector = e.target.getAttribute('page-selector');
        let thisPage = this.pages[ thisPageSelector ];

        _.each(this.pageHandlers,(handler)=> $.removeClass(handler,'selected'));
        _.each(this.pages,(page)=> page.hide());

        $.addClass(e.target,'selected');
        thisPage.show();

    }

    toggle(){
        $.toggleClass(this.html.element,"expended");
        $.toggleClass(this.toggleBtn, "icon-remove");
        $.toggleClass(this.toggleBtn,"icon-arrow-left");
    }

    setAttribiutes(){
        $.addClass(this.html.element,'expended');
    }

}


module.exports = EditorMenu;


















