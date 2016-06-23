/**
 * Created by amir on 24/05/16.
 */

const _ = require('lodash');
const PageSuperClass = require('./page_superclass');

class EditorMenuContent extends PageSuperClass{

    constructor() {
        super("info.html");
    }

    init(currentView){
        this.html.element.appendChild(currentView.getInfoElem().element);
    }

    update(view){
        this.html.element.innerHTML = "";
        this.html.element.appendChild( view.getInfoElem().element );
    }
}


module.exports = EditorMenuContent;


















