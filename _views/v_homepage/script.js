/**
 * Created by amir on 16/05/16.
 */


module.exports = function() {

    let list = localHistory.getTopVisits();
    let ul = document.querySelector('#top-visits');

    if(!list.length){
        return;
    }

    var buildGradientQuery = function(colors){
        return 'linear-gradient(to right,'+ colors.join(',') +') 0% 0% / 200% 200%';
    }

    _.each(list,(item)=>{
        let view = views.getViewForUrl(item.url);
        item.gradientQuery = buildGradientQuery(view.colorTheme);
    });

    list.forEach((item)=>{
        let li =localHistory.itemElementForHomePage(item);
        li.style.background = item.gradientQuery || "black";
        li.style.WebkitBackgroundClip = "text";
        li.style.WebkitTextFillColor = "transparent";


        li.onmouseenter = (e)=> li.classList.add('gradientAnimate');
        li.onmouseleave = (e)=> li.classList.remove('gradientAnimate');

        ul.appendChild(li);
    });




}