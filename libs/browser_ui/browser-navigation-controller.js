const request = require('request');
const _ = require('lodash');
const {addhttp} = require('../browser_webview/url-utils');
const validUrl = require('valid-url');
const urlParser = require('../url-parser');


class Navigation{

    constructor($){
        this.locationInput = $('#location');
        this.form = $('#location-form');
        this.logo = $('#logo');
        this.bar = $('#navigation-bar-bottomLine');
        this.barWrapper = $('#navigation-bar-wrapper');
        this.webView = $('#webview');
        this.suggestionList = $('#suggestionList');
        this.pagesWraper = $('#re-menu-pages-wrapper');
        this.pages = document.querySelectorAll('.re-menu-page');
        this.pagesButtons = document.querySelectorAll('.page-button');
        this.currentOpenPage = null;
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


    go(_url, callbacks){
        let url = urlParser.parse(_url || this.locationInput.value);
        const self = this;

        if(url.home){
            this.resetBarColor();
            callbacks.success({href: url.home});
            return;
        }else if(url.searchQuery){
            url = 'https://duckduckgo.com/html?q='+  url.searchQuery +'&ia=';
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

            // if(response.headers["content-type"] !== "text/html")

            callbacks.success(response.request.uri,_html);

        });

    }



    attachEvents(){

        let self = this;
        let closeHandlers = this.pagesWraper.querySelectorAll('.page-close-button');
        let clearHistoryHandler = this.pagesWraper.querySelector('#clearHistory');
        let createViewHandler = this.pagesWraper.querySelector('#create');

        this.logo.onclick = (e)=> this.toggleMenu(e);
        this.locationInput.onkeyup = (e)=> this.autoComplete(e);

        this.form.onsubmit = (e)=>{
            e.preventDefault();
            navigate();
        };

        _.each(this.pagesButtons,(btn)=>
            btn.onclick = (e)=> this.openPage(btn)
        );

        _.each(closeHandlers,(handler)=>
            handler.onclick = (e)=> this.closePage()
        );

        clearHistoryHandler.onclick = (e)=> {
           localHistoryhistory.clear((err)=>{
                if(!err){
                    self.showHistory();
                }
            });
        }

        createViewHandler.onclick = (e)=> this.createView();
    }


    createView(){

        let inputs = this.pagesWraper.querySelectorAll('.view-input-wrapper>.input');
        let selectedModules = this.pagesWraper.querySelectorAll('.moduleIcon.selected');

        if(!selectedModules.length){
            alert('the view can not be created without any module!');
            return;
        }


        let errors = [];
        let urls = [];

        _.each(inputs,(input)=>{
            if(input.value.trim().length==0){
                input.parentNode.classList.add('error');
                errors.push(input);
            }
            if(input.name=="url"){
                urls.push(input.value.trim());
            }
        })

        if(errors.length){
            alert('you need to fill all the the fields');
            return;
        }


        let viewForUrls = views.getViewsForUrl(urls);

        if(viewForUrls){
            let yes = confirm('there is already a view for this url \n' + viewForUrls.profile.id + ' \nwould you like to deactivate the existed view?');
            if(yes)
                viewForUrls.deactivate();
        }

        console.log(urls);
        // let viewData = localHistory.map(inputs,(input));

        // views.createView()
    }

    openPage(btn){

        if(btn.id=="home"){
            navigate(':home');
            return;
        }

        this.pagesWraper.classList.add('gradientAnimate');
        setTimeout(()=>
            this.pagesWraper.classList.remove('gradientAnimate')
        ,500);

        if(!this.currentOpenPage){
            this.pagesWraper.classList.add('open');
        }
        else if(this.currentOpenPage.getAttribute('for') == btn.id){
            this.closePage();
            return;
        }

        _.each(this.pages,(page)=>{
            page.classList.remove('selected');


            let pageName = page.getAttribute('for');

            if(pageName==btn.id){

                page.classList.add('selected');
                this.currentOpenPage = page;

                if(pageName=="history")
                    this.showHistory();

                if(pageName=="newView") {
                    this.initViewForm();
                }
            }

        });
    }

    initViewForm(){
        let ModuleController = require('../browser_webview/browser_modules_controller');
        let mc = new ModuleController();

        let moduleGallery = this.pagesWraper.querySelector('#module-gallery');
        let dataList = this.pagesWraper.querySelector('#urlslist');

        let dataListItem = localHistory.getList().map((item)=>{
            // dataList.innerHTML += '<option value="'+ item.url +'"/>';
        });

        // dataList.innerHTML = dataListItem.join('');

        moduleGallery.innerHTML = "";

        mc.loadAll( ()=>{
            mc.each((module)=>{
                let icon =  module.getIconElement();
                moduleGallery.appendChild(icon.element);
                // icon.element.onclick = (e)=> icon.highlight();
            })
        })
    }

    showHistory(){
        let list = localHistory.getHistoryList();
        let listContent = this.currentOpenPage.querySelector('.re-menu-page-content');

        listContent.innerHTML = "";

        if(!list){
            listContent.innerHTML = "You don't have any record in your browser history";
        }

        _.each(list,(day,dayName)=>{
            let ul = document.createElement('ul');
            let dayElem = document.createElement('strong');
                dayElem.innerText = dayName;

            ul.appendChild(dayElem);

            _.each(day, (item)=>{
                ul.appendChild( localHistory.itemElementForHistoryPage(item) );
            })

            listContent.appendChild(ul);
        })

    }

    closePage(){
        _.each(this.pages,(page)=>{
            page.classList.remove('selected');
        });

        this.pagesWraper.classList.remove('open');
        this.currentOpenPage = null;
    }


    autoComplete(e){

        let text = this.locationInput.value.toLowerCase().trim();

        if(!text.length) {
            this.resetSuggestionList();
            return;
        }


        if(e.keyCode==40||e.keyCode==38){
            this.setSuggestion(e,text);
            return;
        }

        if(e.keyCode==13||e.keyCode==27){
            this.resetSuggestionList();
            return;
        }

        this.resetSuggestionList();

        this.matchItems = localHistory.getList().filter((item)=>
            item.url.indexOf(text) >-1 || item.title.indexOf(text) >-1
        ).map((item)=>{
            let li = localHistory.itemElementForAdressBar(item);
            this.suggestionList.appendChild(li);
            return li;
        });


        if(this.matchItems.length<3){

        }


        this.suggestionList.style.height = this.matchItems.length * 30 + "px";
    }


    resetSuggestionList(){
        this.suggestionList.innerHTML = "";
        this.currentMatchItemIndex = -1;
        this.suggestionList.style.height = 0;
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


    updateLocation(href){
        this.locationInput.value = href;
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
        this.pagesWraper.style.background = gradientQuery;

        this.logo.style.WebkitBackgroundClip = "text";
        this.logo.style.WebkitTextFillColor = "transparent";

    }

    buildGradientQuery(colors){
        return 'linear-gradient(to right,'+ colors.join(',') +') 0% 0% / 200% 200%';
    }

    toggleMenu(){
        var self = this;

        if(this.currentOpenPage){
            this.closePage();
        }

        self.barWrapper.classList.toggle('extended');
        self.webView.classList.toggle('disable');

        this.loadStarts();
        setTimeout(()=>self.loadEnds(),1000);
        this.isMenuOpen = !this.isMenuOpen;

    }

    loadStarts(){
        console.log('load starts')
        this.bar.classList.add('gradientAnimate');
    }

    loadEnds(){
        console.log('end loading');
        this.bar.classList.remove('gradientAnimate');
    }


}


module.exports = Navigation;








