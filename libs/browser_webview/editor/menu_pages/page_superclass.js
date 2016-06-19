/**
 * Created by amir on 24/05/16.
 */

const join = require('path').join;
const app_root = process.cwd();
const componentsDir = join(app_root,"html_components/editor/pages");
const Template_Engine = require( '../../../html-template-engine' );

class EditorMenuPages{

    constructor(componentDir) {
        this.html = new Template_Engine().createFromPath(join(componentsDir,componentDir));
        this.onChange = null;
    }

    show(){
        this.html.element.classList.add('selected');
    }

    hide(){
        this.html.element.classList.remove('selected');
    }

}


module.exports = EditorMenuPages;


















