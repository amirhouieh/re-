const NavigationController = require('./libs/browser_ui/browser-navigation-controller');
const ViewsController = require('./libs/browser_webview/browser_views_controller');

const views = new ViewsController();
var navigateHandler;

const {ipcRenderer} = require('electron');
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

    function goToEditMode(e) {
        nav.setEditMode();
        views.setEditMode();
    }

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

        nav.go(url,{
            success: (uri,_html)=>{

                if(!uri){
                    views.setHomePage();
                    nav.resetBarColor();
                    return;
                }
                
                views.update(uri,_html);
                nav.updateBarColor(views.currentViewId);
                
            },
            error: (err)=>{
                console.log(err);
            }
        });

    }

    nav.form.onsubmit = function(e) {
        e.preventDefault();
        navigateHandler();
    };

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
