/**
 * Created by amir on 16/05/16.
 */

module.exports = function() {

    // const _ = require('lodash');

    function buildGradientQuery(colors){
        return 'linear-gradient(to bottom,'+ colors.join(',') +') 0% 0% / 200% 200%';
    }

    // let colors = ["#a8a7a7", "#cc527a", "#e8175d", "#474747", "#363636"];
    // let newsItems = this.element.wrapper.querySelectorAll('.__news-item__');
    // let i=0;
    //
    // _.each(newsItems,(item)=>{
    //     let headline = item.querySelector('.story-heading');
    //     headline.style.color = colors[i];
    //     i = i>=colors.length? 0:i+1;
    // })




}