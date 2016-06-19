const request = require('request');
const join = require('path').join;
const _ = require('../utils');

const app_root = process.cwd();
const link_preview_component = join(app_root,"html_components/link_preview.html");

const TEMPLATE = require( '../html-template-engine' );
const link_preview_html = new TEMPLATE().createFromPath(link_preview_component);

const unfluff = require('unfluff');
const sniffLength = 300;

class LinkPreview{

    constructor(){
        this.html = link_preview_html;
        this.content = null;
        this.sniffContainer = this.html.find('.sniff-text');
        this.loadingBar = this.html.find('#loading-bar');
        this.errorContainer = this.html.find('.error');
        this.minHeight = 300;
    }

    init(){
        this.width = this.html.element.offsetWidth;
        this.height = this.html.element.offsetHeight;
        console.log(this.width);
    }

    getSniff(e){
        let self = this;

        let url = e.target.getAttribute('_href');

        self.reset();
        self.show();
        self.setPosition(e);

        request({
            decodeEntities: false,
            uri:url
        },(err, response, _html)=>{

            if(err)
                return self.onError();

            this.content = _html;
            self.showSniff(e);
        });

    }

    reset(){
        this.sniffContainer.innerHTML = "";
        this.loadingBar.classList.remove('hide');
        this.errorContainer.classList.add('hide');
    }



    stopLoading(){
        this.loadingBar.classList.add('hide');
    }
    
    showSniff(e){
        let ex = unfluff.lazy(this.content,'en');
        let text = ex.text();
        
        if(text.length) {
            this.stopLoading();
        }else{
            let text = ex.description();
        }

        if(text)
            this.sniffContainer.innerText = text.slice(0,sniffLength)+'...';

        this.setPosition(e);
    }

    onError(){
        this.stopLoading();
        this.errorContainer.classList.remove('hide');
    }

    show(){
        this.html.element.classList.remove('hide');
    }

    hide(){
        this.html.element.classList.add('hide');
        this.reset();
    }

    setPosition(e){
        let left = e.clientX+20
        let top = e.clientY+20

        this.width = this.html.element.offsetWidth;
        this.height = this.html.element.offsetHeight;

        if(left+this.width>window.innerWidth){
            left = e.clientX-this.width;
        }

        if(top+this.height>window.innerHeight){
            top = e.clientY - this.height;
        }

        this.html.element.style.left = left +'px';
        this.html.element.style.top = top +'px';

    }

}


module.exports = LinkPreview;








