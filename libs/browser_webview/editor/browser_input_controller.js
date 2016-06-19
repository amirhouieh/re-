/**
 * Created by amir on 24/05/16.
 */

const join = require('path').join;
const readFileSync = require('fs').readFileSync;
const guid = require('../../utils').guid;

const app_root = process.cwd();
const number_type_dir = join(app_root,"html_components/editor/css-prop-controller-number.html");
const select_type_dir = join(app_root,"html_components/editor/css-prop-controller-select.html");
const toggle_type_dir = join(app_root,"html_components/editor/css-prop-controller-toggle.html");

const Template = require( '../../html-template-engine' );
const $ = require('../../doc-utils').doc;

const HTML = {
    number: readFileSync( number_type_dir ),
    select: readFileSync( select_type_dir ),
    toggle: readFileSync( toggle_type_dir )
}


class Input{

    constructor(inputData) {
        this.html = new Template().createFromHtml(HTML[inputData.type]);
        this.input = this.html.find('.prop-val');
        this.label =  this.html.find('.prop-name');
        this.input.name = inputData.name;
        this.html.element.classList.add( inputData.type );
        this.label.innerHTML = inputData.label;
        this.onChangeCallback = null;
        this.data = inputData;
        this.css = null
    }

    init(){
        this.input.onchange = (e)=> this.onChangeHandler();
    }

    onChange(){
        this.onChangeCallback(this.css);
    }

    isGeneral(){
        return !this.html.find('input[name="isunique"]').checked;
    }

    setUniqueCheckBox(){
        let uniqueCheckBox = this.html.find('input[name="isunique"]');
        uniqueCheckBox.id = "check-" + guid();
        this.html.find('label.square-button').setAttribute('for', uniqueCheckBox.id);
    }

}

class NumberType extends Input{

    constructor(inputData){

        super(inputData);

        this.min = inputData.min;
        this.max = inputData.max;

        this.html.find('#goup').onclick = (e)=> this.goUp();
        this.html.find('#godown').onclick = (e)=> this.goDown();
    }

    onChangeHandler(){
        this.css = {name:this.data.name,value:this.input.value+"px"};
        super.onChange();
    }

    setVal(val){
        this.input.value = parseInt(val)||"0";
    }

    goUp(){
        let val = this.input.value*1;

        if(typeof this.max&&val>=this.max)
            return;

        this.input.value = val + 1;
        this.onChangeHandler();
    }
    goDown(){
        let val = this.input.value*1;

        if(typeof this.min&&val<=this.min)
            return;

        this.input.value = val-1;
        this.onChangeHandler();
    }

}


class SelectType extends Input{

    constructor(inputData){
        super(inputData);


        this.allValues = [];

        for(let fontSourceName in this.data.options){

            var separator = $.createElement('option');
            separator.disabled = true;
            separator.innerHTML = "---------<strong>"+ fontSourceName +"</strong>---------";
            this.input.appendChild(separator);

            for(let fontName in this.data.options[fontSourceName]){
                let option = $.createElement('option');
                let val = this.data.options[fontSourceName][fontName];
                option.value =  val.toLowerCase();
                option.innerText = val;
                this.input.appendChild(option);
                this.allValues.push(val.toLowerCase());
            }

            var separator = $.createElement('option');
            separator.disabled = true;
            separator.innerHTML = "<br/>";
            this.input.appendChild(separator);

        }
    }

    onChangeHandler(){
        this.css = {name:this.data.name,value:this.input.value};
        super.onChange();
    }

    setVal(val){
        let matchValue = this.allValues.filter((optionVal)=>val.toLowerCase().indexOf(optionVal) !==-1);
        this.input.value = matchValue[0];
    }

}

class ToggleType extends Input{

    constructor(inputData){
        super(inputData);

        let id = guid();
        this.input.id = id;
        this.html.find('.prop-name').setAttribute('for',id);

    }

    onChangeHandler(){

        if(this.input.checked){
            this.css = {name:this.data.name,value:this.data.value};
        }else{
            this.css = {name:this.data.name,value:""};
        }

        this.label.classList.toggle('selected');

        super.onChange();
    }

    setVal(val){
        this.input.checked = true;
    }

}



module.exports.number = NumberType;
module.exports.select = SelectType;
module.exports.toggle = ToggleType;
