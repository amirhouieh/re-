/**
 * Created by amir on 16/05/16.
 */

module.exports = function() {

    var img = new Image;

    img.src = "resources/media/re-web.png"

    let wrapper = document.querySelector('.module-content-wrapper[name="re-browser.github.io"]');


        wrapper.appendChild(img);

}