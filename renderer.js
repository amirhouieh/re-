// renderer.loadViews();
// renderer
//     .forEachView((view)=> webView.appendChild(view.element))
//     .then((viewsColorList)=> nav.init(viewsColorList))
//     .catch((err)=>console.error(err));
// renderer.render(url,(currentViewId)=> nav.updateBarColor(currentViewId));
const request = require('request');

const ViewsController = require('./libs/browser_webview/browser_views_controller');
const vc = new ViewsController();

const cpuIntensive = {

  doStuff() {
    var value = 0;
    for (var i = 0; i < 100000000; i++) {
      value += Math.random();
    }
    return Math.floor(value / Math.random());
  },

  doCallbackStuff(cb) {
    var newPercent = 0;
    for (var i = 0; i < 100000000; i++) {
      if (newPercent === Math.floor(i / 100000000 * 100)) {
        cb(Math.floor(newPercent++));
      }
    }
  },


    loadViews(){
        vc.load();
    },

    eachViewHtml(callback){

        vc.init();

        vc.each((view)=>{
            callback(view.html());
        });

        console.log(vc.colorList);

        return vc.colorList;
    },

    eachModuleHtml(callback){

        vc.all[vc.currentViewId].each((module)=>{
            callback(module.id, module.html());
        });
    },

    render(url,callback){

        request({
            // encoding:'binary',
            decodeEntities: false,
            uri:url
        }, (err, response, _html)=>{

            vc.update(response,_html);
            callback(vc.currentViewId);

        });
    }


};

module.exports = cpuIntensive;
