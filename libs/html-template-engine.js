/**
 * Created by amir on 26/05/16.
 */


const _ = require('./utils');
const readFileSync = require('fs').readFileSync;

class Template{

    constructor(templatePath, props){
        this.renge = document.createRange();
        this.element = null;
    }

    createFromPath(templatePath, props){
        let rawHtml = readFileSync(templatePath);
        this.createFromHtml(rawHtml,props);
        return this;
    }

    readHtml(_path){
        return readFileSync(_path);
    }

    createFromHtml(rawHtml,props){
        this.element = this.renge.createContextualFragment(rawHtml).firstChild;
        this.fillText(props);
        return this;
    }

    fillText(props){
        let self = this;
        _.eachObj(props,(propName,propVal)=>{
            let elem = self.find( '[name="'+ propName +'"]' );

            if(elem)
                elem.innerHTML = propVal;
        })
    }

    setAttr(){
        
    }
    
    find(selector){
        return this.element.querySelectorAll(selector)[0];
    }
    findAll(selector){
        return this.element.querySelectorAll(selector);
    }

}

module.exports = Template;