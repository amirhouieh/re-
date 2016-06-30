/**
 * Created by amir on 16/05/16.
 */

module.exports = function() {

    console.log('excute');

    let textModule = this.getModule('cm_1464123928083');
    let imageModule = this.getModule('cm_image');

    this.each((module)=>{
        module.element.classList.remove('full-width');
    });
    

    if(textModule.error){
        imageModule.element.classList.add('full-width');
    }


    if(imageModule.error){
        textModule.element.classList.add('full-width');
    }


}