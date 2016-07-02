/**
 * Created by amir on 24/05/16.
 */

const _ = require('lodash');

const docUtil = require( '../../../doc-utils' );
const PageSuperClass = require('./page_superclass');
const CssEditor = require('../browser_editor_css_editor_class');

const cssSelector = new docUtil.CssSelectorGenerator;
const $ = docUtil.doc;

const SelectorTypes = {
    ID: 'id',
    CLASSNAME: 'classname',
    TAGNAME: 'tagname',
    UNIQUE: 'unique'
}

const ToolBoxNames = ['presets','typography','layout','css'];

class EditorMenuDesign extends PageSuperClass{

    constructor() {

        super("design.html");

        this.cssPropList = require('../../../css_prop_list');

        this.selectorHandlers = {};
        this.moduleHandlers = [];
        this.toolboxes = {}
        this.inputs = [];
        this.cssRules = [];
        this.currentModuleSelector = null;

        this.cssEditor = new CssEditor();

        this.selectedElementStyle = null;
        this.selectedElementSelectorQueries = null;
        this.querySelector = null;

        this.viewId = null;

        this.onChange = null;

        _.each(SelectorTypes,(selectorType)=>
            this.selectorHandlers[ selectorType ] = this.html.find('.css-query-selector#'+ selectorType)
        );

        _.each(ToolBoxNames,(toolName)=>
            this.toolboxes[toolName] = this.html.find('.toolbox#'+ toolName + '_toolbox')
        );

    }

    init(view){
        this.initModuleHandlers(view);
        this.attachEvents();
        this.initFonts();
        this.initForms();
        this.initPresets();
        this.viewId = view.id;
        this.cssEditor.init(this.toolboxes.css);
        this.cssEditor.onChange = (cssProp)=> {this.onChange(cssProp);}
    }

    reset(){
        this.cssRules = [];
    }

    getCssRules(){
        let temp = _.groupBy(this.cssRules,'selector');
        let inlineStyles = {};

        _.each(temp,(rules,selector)=> {
            inlineStyles[selector] = _.map(_.groupBy(rules, 'rule.name'), (rule)=>rule.pop().rule)
        });

        return Object.keys(inlineStyles).length?inlineStyles:null;
    }

    updateView(view){
        this.initModuleHandlers(view);
        this.selectedElementStyle = null;
        this.selectedElementSelectorQueries = null;
        this.querySelector = null;
    }

    initModuleHandlers(view){
        let wrapper = this.html.find('.modules-selector');
        wrapper.innerHTML = "";
        this.moduleHandlers = [];
        
        view.each((module)=>{
            let handler = moduleHandler(module);
            wrapper.appendChild(handler);
            this.moduleHandlers.push(handler);
        });
    }
    
    initPresets(){
        let presetsWrapper = this.html.find('#presets_toolbox');

        _.each(this.cssPropList.presets,(preElem)=>{
            preElem.onclick = (e)=>{
                console.log(preElem.dataset);
            }

            presetsWrapper.appendChild(preElem);
        })

    }
    initFonts(){
        this.cssPropList.setSystemFonts();
    }

    initForms(){

        let cssInputController = require('../browser_input_controller');
        let self = this;

        _.each(this.cssPropList.list.defaults, (groups,cssCatName)=>{

            let formWrapper = this.toolboxes[cssCatName];

            _.each(groups,(group,groupName)=>{

                let form = $.createElement('form');
                form.name = groupName;

                _.each(group,(inputData)=>{
                    let input = new cssInputController[ inputData.type ]( inputData );
                    input.init();

                    input.onChangeCallback = (cssProp)=> {
                        self.updateCssRules(cssProp);
                        self.onChange(cssProp);
                    }

                    form.appendChild( input.html.element );
                    self.inputs.push(input);
                })

                formWrapper.appendChild(form);
            });

        });

    }

    updateCssRules(cssProp){
        
        let query = this.currentModuleSelector==this.querySelector?
                        this.currentModuleSelector :
                        this.currentModuleSelector+' ' + this.querySelector;

        query = '#' + this.viewId +" " + query;
        this.cssRules.push({selector: query, rule: cssProp});
    }
    
    attachEvents() {

        _.each(this.selectorHandlers,(handler)=>
            handler.onclick = (e) =>
                this.updateSelectorHandlers(handler.id)
        );

    }
    
    update(targetElement,_selectorType){

        //one of id, tagname, classname, or unique
        //default SelectorTypes.TAGNAME
        let selectorType = _selectorType;

        if(selectorType){
            //it is a module wrapper
            this.currentModuleSelector = '#' + targetElement.id;
        }else{
            selectorType = SelectorTypes.TAGNAME;
        }

        this.setSelectedElement(targetElement);
        this.updateSelectorHandlers(selectorType);
        this.updateFields();

        this.cssRules = [];
    }

    setSelectedElement(targetElement){
        this.selectedElementStyle = getComputedStyle(targetElement);
        this.selectedElementSelectorQueries = createCssSelector(targetElement);
    }

    updateFields(){

        _.each(this.inputs,(input)=>{
            let cssPropName = input.data.name;
            let cssPropValue = this.selectedElementStyle.getPropertyValue(cssPropName);
            if(cssPropValue.length) {
                input.setVal(cssPropValue);
                this.updateCssRules({name: cssPropName,value: cssPropValue});
            }
        });

    }

    setQuerySelector(selectorHandler){
        this.querySelector = selectorHandler.getAttribute('selector');
        this.cssEditor.updateCurrentQuery( this.querySelector );
    }

    setSelectorHandler(handler){
        handler.innerText = this.selectedElementSelectorQueries[handler.id];
        handler.setAttribute('selector', this.selectedElementSelectorQueries[handler.id] );
        $.addClass(handler,'ignore');
    }

    updateSelectorHandlers(selectorType){

        let selectorHandler = this.selectorHandlers[selectorType];

        //set all selector Handlers
        _.each(this.selectorHandlers,(handler)=> this.setSelectorHandler(handler));

        //mark selector handler
        $.removeClass(selectorHandler,'ignore');
        this.setQuerySelector(selectorHandler);
    }

}

function moduleHandler(module) {
    let handler = $.createElement('span');
    handler.id = module.profile.id;
    handler.setAttribute('selector','#'+module.profile.id);
    handler.appendChild(module.getIconElement().element);
    return handler;
}

function createCssSelector(elem) {

    return {
        tagname: elem.tagName.toLowerCase(),
        id: elem.id.trim().length? '#'+elem.id: '',
        classname: elem.className.trim().length? '.'+elem.className.split(' ').join('.'): '',
        unique:  cssSelector.getSelector(elem)
    }
}


module.exports = EditorMenuDesign;


















