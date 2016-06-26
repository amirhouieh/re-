const NavigationController = require('./libs/browser_ui/browser-navigation-controller');
const ViewsController = require('./libs/browser_webview/browser_views_controller');
const HistoryManager = require('./libs/history-manager');
const {ipcRenderer} = require('electron');

const views = new ViewsController();
const history = new HistoryManager();

var navigate;
var refresh;
var currentUrl;

views.load();
history.init();

ipcRenderer.send('url-to-chrome', 'test');

onload = function() {


    var _$ = function(query) {
      return document.querySelector(query);
    }

    const nav = new NavigationController(_$);

    var webView = _$('#webview');
    var linkToEditMode = _$('#viewEditor');

    views.init(webView);
    nav.init(views.colorList);

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

        // setTimeout(()=>{
        //     ipcRenderer.send('url-to-chrome', url||nav.locationInput.value);
        // },500)

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
                history.add(url,_html);
                currentUrl = url;
            },
            error: (err)=>{
                console.log(err);
            }
        });

    }

    window.onbeforeunload = (e) => history.updateStorage(e);
    linkToEditMode.onclick = (e)=> goToEditMode(e);

    navigate();

}