const NavigationController = require('./libs/browser_ui/browser-navigation-controller');
const ViewsController = require('./libs/browser_webview/browser_views_controller');
const HistoryManager = require('./libs/history-manager');
const {ipcRenderer} = require('electron');

const views = new ViewsController();
const history = new HistoryManager();

var navigateHandler;
var refresh;
var currentUrl;

views.load();
ipcRenderer.send('url-to-chrome', 'test');

onload = function() {


    var _$ = function(query) {
      return document.querySelector(query);
    }


    const nav = new NavigationController(_$);
    
    var hasScrollStart = false;
    var hasScrollStop;
    var webView = _$('#webview');
    var homeWrapper = _$('#v_home');
    var logo = _$('#logo');
    var linkToEditMode = _$('#viewEditor');

    views.init(webView);
    nav.init(views.colorList);
    history.init();
    
    function goToEditMode(e) {

        if(views.editor) {
            views.unsetEditMode();
            nav.toggleMenu();
            return
        }

        views.setEditMode();
    }

    refresh = () =>{
        navigateHandler(currentUrl);
    };

    navigateHandler = (link)=>{

        let url = null;

        if(typeof link == "string") {
            url = link
        }else if(link){
            url = link.getAttribute('_href');
        }

        url = url||nav.locationInput.value;

        // setTimeout(()=>{
        //     ipcRenderer.send('url-to-chrome', url||nav.locationInput.value);
        // },500)

        if(nav.isMenuOpen){
            nav.toggleMenu();
        }

        if(views.editor){
            views.unsetEditMode();
            return;
        }

        nav.go(url,{
            success: (uri,_html)=>{
                
                views.update(uri,_html);
                nav.updateBarColor(views.currentViewId);
                history.add(url,_html);
                currentUrl = url;
                
            },
            error: (err)=>{
                console.log(err);
            }
        });

    }

    nav.form.onsubmit = (e)=>{
        e.preventDefault();
        navigateHandler();
    };

    window.onbeforeunload = (e) => history.updateStorage(e);
    linkToEditMode.onclick = (e)=> goToEditMode(e);
    navigateHandler();
}


function showScrollBar() {
    var sheets = document.styleSheets[0];
    sheets.deleteRule(sheets.rules.length-1);
    return false;
}

function hideScrollBar() {
    var sheets = document.styleSheets[0];
    document.styleSheets[0].insertRule("::-webkit-scrollbar{width: 0px!important;}",sheets.rules.length);
    return true;
}
