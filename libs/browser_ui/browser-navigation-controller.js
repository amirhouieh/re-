const request = require('request');
const _ = require('../utils');

class Navigation{

    constructor($){
        this.wrapper = $('#navigation-bar');
        this.locationInput = $('#location');
        this.form = $('#location-form');
        this.logo = $('#logo');
        this.bar = $('#navigation-bar-bottomLine');
        this.barWrapper = $('#navigation-bar-wrapper');
        this.webView = $('#webview');
        this.theme = {colors: [], gradientQuery:null};
        this.colorList = null;
        this.currentViewId = null;
    }

    init(colors){
        this.colorList = colors;
        this.resetBarColor();
        this.attachEvents();
    }


    attachEvents(){
        let self = this;

        this.logo.onclick = (e)=> self.toggleMenu(e);
    }
    
    go(_url, callbacks){
        let url = _url || this.locationInput.value;
        const self = this;


        if(_url.trim() == "home"){
            callbacks.success();
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
        this.toggleMenu();
    }

    updateBarColor(viewId){

        if(viewId==this.currentViewId)
            return;

        this.setThemeColor( this.colorList[viewId] );
        this.currentViewId = viewId;
    }



    resetBarColor(){
        let allViewsColors = [];

        _.eachObj(this.colorList, (viewId,colors)=> {
            _.eachArr(colors, (i,color)=> allViewsColors.push(color));
        });

        this.setThemeColor( allViewsColors );

    }

    setThemeColor(colors){
        let gradientQuery = this.buildGradientQuery(colors);

        this.bar.style.background = gradientQuery;
        this.logo.style.background = gradientQuery;

        this.logo.style.WebkitBackgroundClip = "text";
        this.logo.style.WebkitTextFillColor = "transparent";

    }

    buildGradientQuery(colors){
        return 'linear-gradient(to right,'+ colors.join(',') +')';
    }

    toggleMenu(){
        var self = this;

        self.bar.classList.toggle('hidden');
        self.barWrapper.classList.toggle('extended');
        self.webView.classList.toggle('disable');

        setTimeout(function () {
            self.bar.classList.remove('hidden');
        }, 300)

    }

    loadStarts(){
        var self= this;

        console.log('start loading');
        this.timer = setInterval(function () {
            self.bar.classList.toggle('hidden');
        }, 500);

    }

    loadEnds(){
        console.log('end loading');
        this.bar.classList.remove('hidden')
        clearInterval(this.timer);
    }
    
}


module.exports = Navigation;








