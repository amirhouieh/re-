const NavigationController = require('./libs/browser_ui/browser-navigation-controller');
const ViewsController = require('./libs/browser_webview/browser_views_controller');
const HistoryManager = require('./libs/history-manager');
const {ipcRenderer} = require('electron');

const views = new ViewsController();
const localHistory = new HistoryManager();

const msgList = {
    DEFAULT: 'url-for-chrome',
    VIDEO: 'video',
    CONNECTION: 'connection-success',
    HOME: 'homepage'
}


var navigate;
var refresh;
var currentUrl;

views.load();
localHistory.init();

ipcRenderer.send(msgList.CONNECTION,'re is connected to chrome!');


onload = function() {


    var _$ = function(query) {
      return document.querySelector(query);
    }

    const nav = new NavigationController(_$);

    var webView = _$('#webview');
    var linkToEditMode = _$('#viewEditor');
    let video = _$('#video');
    let videoPlayHandler = document.querySelector('#fullscreen-handler');
    let videoCancelHandler = document.querySelector('#cancel-fullScreen-handler');

    let isIdleMode = false;
    let idleTime = 1000000;

    var timer = null;
    var urls = [];
    var prevUrl = null;

    views.init(webView);
    nav.init(views.colorList);

    var playVideo = function(e) {
        video.load();
        video.classList.add('show');
        video.play();
    }

    var stopVideo = function () {
        video.pause();
        video.classList.remove('show');
        isIdleMode = false;
    }

    var goToEditMode = (e) => {

        if(views.editor) {
            views.unsetEditMode();
            nav.toggleMenu();
            return;
        }

        nav.closePage();
        views.setEditMode();
    }

    refresh = () =>{
        navigate(currentUrl);
    };
    navigate = (link)=>{

        let url = null;

        if(typeof link == "string") {
            url = link
        }else if(link){
            url = link.getAttribute('_href');
        }


        url = url||nav.locationInput.value;

        if(url=="http://localhost:3000/re"){
            ipcRenderer.send('website');
        }

        if(url==":home") {
            ipcRenderer.send(msgList.HOME);
            stopVideo();
        }
        else{
            setTimeout(()=>{
                ipcRenderer.send(msgList.DEFAULT, url);
            },500)
        }

        if(nav.isMenuOpen)
            nav.toggleMenu();

        if(views.editor) {
            views.unsetEditMode();
            return;
        }

        nav.resetSuggestionList('from navigate');

        nav.go(url,{
            success: (uri,_html)=>{
                views.update(uri,_html);
                nav.updateBarColor(views.currentViewId);
                localHistory.add(url,_html);
                prevUrl = urls.pop();
                urls.push(url);
            },
            error: (err)=>{
                console.log(err);
            }
        });

    }


    function shortcuts(e) {
        switch (e.keyCode){
            case 8:
                if(e.target.id!=="location"&&prevUrl)
                    navigate(prevUrl);
                break;
            default:
                break;
        }
    }


    function resetTimer(e) {

        clearTimeout(timer);
        //after idle time start video
        if(isIdleMode){
            navigate(':home');
            isIdleMode = false;
        }

        timer = setTimeout(()=>{
            isIdleMode = true;
            ipcRenderer.send(msgList.VIDEO);
            playVideo();
        }, idleTime);


    }

    window.onbeforeunload = (e) => localHistory.updateStorage(e);
    linkToEditMode.onclick = (e)=> goToEditMode(e);

    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onkeyup = shortcuts;

    navigate();
    resetTimer();

}