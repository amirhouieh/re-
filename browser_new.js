const NavigationController = require('./libs/browser_ui/browser-navigation-controller');
const {ipcRenderer} = require('electron');
const foreground = require('electron-process').foreground;
const renderer = foreground.getModule(require('./renderer'));
renderer.loadViews();


onload = function() {


    let range = document.createRange();

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
    let viewsWrapper = {};

    // views.init(webView);

    renderer
        .eachViewHtml((viewhtml)=> {
            let viewWrapper = range.createContextualFragment(viewhtml).firstChild;
            webView.appendChild(viewWrapper);
            viewsWrapper[viewWrapper.id] = viewWrapper;
        })
        .then((viewsColorList)=>{
            nav.init(viewsColorList);
        })
        .catch((err)=>console.error(err));



    function goToEditMode(e) {
        nav.setEditMode();
        // views.setEditMode();
    }

    navigateHandler = (link)=>{

        let url = null;

        if(typeof link == "string") {
            url = link
        }else if(link){
            url = link.getAttribute('_href');
        }

        url = url||nav.locationInput.value;

        setTimeout(()=>{
            ipcRenderer.send('url-to-chrome', url);
        },500)


        nav.loadStarts();
        renderer.render(url,(currentViewId)=>{

            let currentViewWrapper = viewsWrapper[currentViewId];

            
            for(var x in viewsWrapper)
            
                viewsWrapper[x].style.display = "block";


            renderer.eachModuleHtml((moduleId,moduleContent)=>{
                currentViewWrapper.querySelector('#'+moduleId).outerHTML = moduleContent;
            });
            
            nav.updateBarColor(currentViewId)
        });


        // nav.go(url,{
        //     success: (uri,_html)=>{
        //
        //         if(homeWrapper.className.indexOf('off')===-1) {
        //             homeWrapper.classList.add('off');
        //         }
        //
        //         document.body.style.background = 'transparent';
        //
        //         views.update(uri,_html);
        //         nav.updateBarColor(views.currentViewId);
        //         // views.setEditMode();
        //     },
        //     error: (err)=>{
        //         console.log(err);
        //     }
        // });

    }

    nav.form.onsubmit = function(e) {
        e.preventDefault();
        navigateHandler();
    };

    linkToEditMode.onclick = (e)=> goToEditMode(e);

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
