const NavigationController = require('./libs/browser_ui/browser-navigation-controller');
const ViewsController = require('./libs/browser_webview/browser_views_controller');

const views = new ViewsController();

views.load(function () {
    console.log( views.all )
});

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
    var linkToEditMode = _$('#edit-mode');

    nav.init(2)
    views.init(webView);

    navigateHandler = function(link) {

        let url = null;

        if(typeof link == "string") {
            url = link
        }else if(link){
            url = link.getAttribute('_href');
        }

        nav.go(url,{
            success: (uri,_html)=>{

                if(homeWrapper.className.indexOf('off')===-1) {
                    homeWrapper.classList.add('off');
                }

                document.body.style.background = 'transparent';

                views.update(uri,_html);

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


    webView.onscroll = function (e) {

        if(hasScrollStart){
            hasScrollStart = showScrollBar();
        }

        clearTimeout(hasScrollStop);
        hasScrollStop = setTimeout(function(){
            hasScrollStart = hideScrollBar();
        },1000);

    }

    logo.onclick = function (e) {
        nav.toggleMenu();
    }

    linkToEditMode.onclick = function (e) {
        console.log('hi')
        nav.updateLocation( "editor:" + nav.locationInput.value);
        nav.toggleMenu();
        views.setEditMode();
    }


    // navigateHandler();


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
