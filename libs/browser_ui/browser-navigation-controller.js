const request = require('request');
const _ = require('lodash');

class Navigation{

    constructor($){
        this.wrapper = $('#navigation-bar');
        this.locationInput = $('#location');
        this.form = $('#location-form');
        this.logo = $('#logo');
        this.bar = $('#navigation-bar-bottomLine');
        this.barWrapper = $('#navigation-bar-wrapper');
        this.webView = $('#webview');
        this.suggestionList = $('#suggestionList');
        this.theme = {colors: [], gradientQuery:null};
        this.colorList = null;
        this.currentViewId = null;
        this.matchItems = [];
        this.currentMatchItemIndex = 0;
        this.isMenuOpen = false;
    }

    init(colors){
        this.colorList = colors;
        this.resetBarColor();
        this.attachEvents();
        this.gradientQueryForSuggestionList = this.buildGradientQuery(this.getAllColors())
    }


    attachEvents(){
        this.logo.onclick = (e)=> this.toggleMenu(e);
        this.locationInput.onkeyup = (e)=> this.autoComplete(e);

    }

    autoComplete(e){

        let text = this.locationInput.value.toLowerCase().trim();

        if(!text.length) {
            this.resetSuggestionList()
            return;
        }


        if(e.keyCode==40||e.keyCode==38){
            this.setSuggestion(e,text);
            return;
        }

        this.resetSuggestionList()

        this.matchItems = history.getList().filter((item)=>
            item.url.indexOf(text) >-1 || item.title.indexOf(text) >-1
        ).map((item)=>{
            let li = document.createElement('li');
            li.setAttribute('url',item.url)
            li.innerHTML = item.url + ' | <small><i>'+item.title.slice(0,40) + '... <small class="count">(visits:'+ item.count  + ')</small></i>';
            this.suggestionList.appendChild(li);
            return li;
        });

        this.suggestionList.style.height = this.matchItems.length * 20 + "px";
    }


    resetSuggestionList(){
        this.suggestionList.innerHTML = "";
        this.currentMatchItemIndex = -1;
    }

    selectSuggestion(text){
        let item = this.matchItems[this.currentMatchItemIndex];

        this.updateLocation( item.getAttribute('url') );
        item.classList.add('selected');

    }

    setSuggestion(e){

        if(!this.matchItems.length)
            return;

        _.each(this.matchItems,(item)=> item.classList.remove('selected'));


        switch (e.keyCode){
            //up
            case 38:
                this.currentMatchItemIndex-=1;
                if(this.currentMatchItemIndex<0){
                    this.currentMatchItemIndex = 0;
                }
                break;

            //down
            case 40:
                this.currentMatchItemIndex+=1;
                if(this.currentMatchItemIndex>=this.matchItems.length){
                    this.currentMatchItemIndex = this.matchItems.length -1;
                }
                break;

            default:
                break;
        }

        this.selectSuggestion();

    }

    
    
    go(_url, callbacks){
        let url = _url || this.locationInput.value;
        const self = this;

        if(_url.trim() == ":home"){
            this.resetBarColor();
            callbacks.success({href: ":home"});
            return;
        }

        this.loadStarts();

        request({
            // encoding:'binary',
            decodeEntities: false,
            uri:url
        }, function(err, response, _html) {

            self.loadEnds();
            self.updateLocation(response.request.uri.href);

            if(err)
                return callbacks.error(err);

            callbacks.success(response.request.uri,_html);

        });

    }

    updateLocation(href){
        this.locationInput.value = href;
    }

    setEditMode(){
        this.updateLocation( "editor:" + this.locationInput.value );
    }

    updateBarColor(viewId){

        if(viewId==this.currentViewId)
            return;

        this.setThemeColor( this.colorList[viewId] );
        this.currentViewId = viewId;
    }



    resetBarColor(){
        this.setThemeColor( this.getAllColors() );
    }

    getAllColors(){
        let allViewsColors = [];

        _.each(this.colorList, (colors,viewId)=> {
            _.each(colors, (color,i)=> allViewsColors.push(color));
        });

        return allViewsColors
    }

    setThemeColor(colors){
        let gradientQuery = this.buildGradientQuery(colors);

        this.gradientQuery = gradientQuery;

        this.bar.style.background = gradientQuery;
        this.logo.style.background = gradientQuery;
        this.suggestionList.style.background = gradientQuery;

        this.logo.style.WebkitBackgroundClip = "text";
        this.logo.style.WebkitTextFillColor = "transparent";

    }

    buildGradientQuery(colors){
        return 'linear-gradient(to right,'+ colors.join(',') +') 0% 0% / 200% 200%';
    }

    toggleMenu(){
        var self = this;

        self.barWrapper.classList.toggle('extended');
        self.webView.classList.toggle('disable');

        this.loadStarts();
        setTimeout(()=>self.loadEnds(),1000);
        this.isMenuOpen = !this.isMenuOpen;

    }

    loadStarts(){
        var self= this;
        console.log('starts loading');
        self.bar.classList.add('gradientAnimate');
    }

    loadEnds(){
        console.log('end loading');
        this.bar.classList.remove('gradientAnimate');
    }
    
}


module.exports = Navigation;








