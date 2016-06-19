/**
 * Created by amir on 24/05/16.
 */

const _ = require('lodash');
const join = require('path').join;
const $ = require( '../../doc-utils' ).doc;

const Template_Engine = require( '../../html-template-engine' );
const TM = new Template_Engine();

const app_root = process.cwd();
const cssInputBlockComponentPath = join(app_root,"html_components/editor/css-input-block-wrapper.html");
const cssInputPropComponentPath = join(app_root,"html_components/editor/css-input-prop-wrapper.html");

const cssInputBlockComponentHTML = TM.readHtml(cssInputBlockComponentPath);
const cssInputPropComponentHTML = TM.readHtml(cssInputPropComponentPath);

const cssPropList = require(join(app_root,'resources/css_prop_list.json'));

class CssEditor{

    constructor(){
        this.wrapper = null;
        this.editor = null;
        this.currentQuery = null;
        this.blocks = {};
        this.onChange = null;
    }

    init(wrapper,selector){
        this.wrapper = wrapper;
        this.editor = this.wrapper.querySelector('.css-blocks-wrapper');
        this.attachEvents();
    }

    addBlock(selector){
        let block = new CssBlock(selector);
        block.onSubmit = (cssProp)=> this.onChange(cssProp);
        this.blocks[block.selector] = block;
        this.editor.appendChild(block.html.element);
    }

    showBlock(query){
        let block = this.blocks[query];
        this.editor.appendChild(block.html.element);
    }

    updateCurrentQuery(query){
        this.clear();

        if(!this.blocks[query]){
            this.addBlock(query);
        }else{
            this.showBlock(query);
        }

        this.currentQuery = query;

    }

    clear(){
        this.editor.innerHTML = "";
    }

    attachEvents(){

    }
    

}

class CssBlock{

    constructor(selector){
        this.html = new Template_Engine().createFromHtml(cssInputBlockComponentHTML);
        this.selectorInput = this.html.find('.css-selector');
        this.propsWrapper = this.html.find('.css-props-wrapper');
        this.selector = selector;
        this.inputs = [];
        this.init();
        this.onSubmit = null;
    }

    init(){
        this.selectorInput.value = this.selector;
        this.fitInputSize(this.selectorInput);
        this.selectorInput.onkeyup = (e)=>this.fitInputSize(e.target);
        this.propsWrapper.onclick = (e)=> this.addInputPair(e);
    }

    fitInputSize(input){
        input.setAttribute('size',input.value.length+1);
    }

    addInputPair(e){

        if(e.target.nodeName.toLowerCase()=='input')
            return;

        let inputPair = new CssInputPair(this.inputs.length-1);
        inputPair.onSubmit = (cssProp)=>this.onSubmit(cssProp);
        this.propsWrapper.appendChild( inputPair.html.element );
        this.inputs.push(inputPair);
    }

}

class CssInputPair{
    
    constructor(index){
        this.html =  new Template_Engine().createFromHtml(cssInputPropComponentHTML);
        this.nameInput = this.html.find('.css-prop-name');
        this.valueInput = this.html.find('.css-prop-val');

        this.index = index;
        this.name = null;
        this.value = null;
        this.onSubmit = null;
        this.attachEvent();
    }

    attachEvent(){
        this.nameInput.onkeydown = (e)=> this.onKey(e);
        this.valueInput.onkeydown = (e)=> this.onKey(e);
    }

    onKey(e){

        switch (e.keyCode){
            case 27:
                this.cancle(e)
                break;
            case 13 || 9:
                this.validate(e)
                break;
            default:
                break;
        }

    }


    validate(e){
        let inputName = e.target.name;
        let inputVal = e.target.value.toLowerCase().trim();

        if( inputName == "label" ){
            let match = cssPropList.filter((cssProp)=>cssProp.label == inputVal);

            if(!match.length){
                $.addClass(e.target,'notvalid');
                e.preventDefault();
                return false;
            }

        }else{
            let match = this.onSubmit({name:this.nameInput.value,value:this.valueInput.value});
        }

        this.accept(e);
    }

    cancle(){

    }

    accept(e){

        if(e.target.name="label"){
            this.valueInput.focus();
        }else{
            $.addClass(this.html.element,'accepted');
        }

    }

}


module.exports = CssEditor;


















