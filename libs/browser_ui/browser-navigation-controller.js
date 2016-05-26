const request = require('request');

class Navigation{

    constructor($){
        this.wrapper = $('#navigation-bar');
        this.locationInput = $('#location');
        this.form = $('#location-form');
        this.bar = $('#navigation-bar-bottomLine');
        this.barWrapper = $('#navigation-bar-wrapper');
        this.webView = $('#webview');
    }

    init(numberOfProfiles){
        this.numberOfProfiles = numberOfProfiles;
        this.buildBarColor();
    }
    
    go(_url, callbacks){
        let url = _url || this.locationInput.value;
        const self = this;

        this.loadStarts();

        request({
            encoding:'binary',
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

    buildBarColor(){

        let w = this.bar.offsetWidth;
        let h = this.bar.offsetHeight;
        let colors = [];

        for(var x=0; x<this.numberOfProfiles; x++)
            colors.push( newRandomColor() );

        let gradientQuery = 'linear-gradient(to right,'+ colors.join(', ') +')';
        this.bar.style.background = gradientQuery;

    }

    toggleMenu(){
        var self = this;

        self.buildBarColor();
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
            self.buildBarColor();
        }, 500);
    }

    loadEnds(){
        console.log('end loading');
        this.bar.classList.toggle('hidden')
        clearInterval(this.timer);
    }
    
}

function newRandomColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

module.exports = Navigation;








