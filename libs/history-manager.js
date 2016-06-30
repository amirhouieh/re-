/**
 * Created by amir on 26/05/16.
 */

const _ = require('lodash');
var dateFormat = require('dateformat');

const storage = require('electron-json-storage');
// const HistoryItem = require('./history-item');
var itemList = [];

const titleRegex = /<title[^>]*>([^<]+)<\/title>/;
const protocolRegex = /.*?:\/\//g;

class HistoryItem{

    constructor(url,title){
        this.url = url.toLowerCase();
        this.title = title.toLowerCase();
        this.time = new Date().getTime();
        this.count = 1;
    }

}

class History{

    constructor(){
        this.data = null;
    }

    init(){
        // storage.clear((err)=>console.log(err));
        storage.get('history', function(error, data) {
            if (error) throw error;

            itemList = data.length? data:[];
            console.log('initial list',itemList)
        });
    }


    add(url,_html){

        let title = _html.match(titleRegex);

        if(!_html || !title)
            return;

        url = url.toLowerCase().trim();

        title = title[1];
        let itemInHistory = itemList.filter((item)=>item.url==url);

        //if the url is not already in history
        if( !itemInHistory.length ) {
            itemList.push(new HistoryItem(url, title));
        }
        //otherwise we only increase the count
        else {
            itemInHistory[0].count += 1;
            itemInHistory[0].time = new Date().getTime();
        }

    }


    getList(){
        return itemList;
    }

    clear(callback){
        itemList = [];
        storage.clear((err)=>callback);
    }

    getHistoryList(){

        let newList =
            _.cloneDeep(itemList)
            .sort((a,b)=>b.time-a.time)
            .map((item)=>
                {
                    let date = new Date(item.time);

                    item.time = {
                        ms: item.time,
                        date: dateFormat(date, "dddd, mmmm dS, yyyy"),
                        detailDate: dateFormat(date, 'h:MM tt')
                    };

                    return item;
                });

        newList = _.groupBy(newList,(item)=>item.time.date);
        return Object.keys(newList).length? newList:null;
    }

    getTopVisits(){
        return _.cloneDeep(itemList)
                    .sort((a,b)=>b.count-a.count)
                    .slice(0,3)
    }

    itemElementForAdressBar(item){
        let li = document.createElement('li');
        li.setAttribute('url',item.url)
        li.innerHTML = item.url + ' | <small><i>'+item.title.slice(0,40) + '... <small class="count">(visits:'+ item.count  + ')</small></i>';
        return li;
    }

    itemElementForHomePage(item){
        let li = document.createElement('li');
        let title = '<span class="itemTitle"><a href="javascript:;" onclick="navigate(this);" _href="'+ item.url +'">' + item.title +'</a></span>';
        let link = '<small>' + item.url.replace(protocolRegex,'') + '</small>';
        li.innerHTML = title + link;
        return li;
    }

    itemElementForHistoryPage(item){
        let li = document.createElement('li');
        let time = '<time>'+item.time.detailDate+'</time>';
        let itemContentWrapper = '<div class="item-content-wrapper">';

        let link = '<small><i><a href="javascript:;" onclick="navigate(this);" _href="'+ item.url +'">' + item.url.replace(protocolRegex,'') +'</i></a></small>';
        let title = '<span class="itemTitle">' + item.title + '</span>';
        let visits = '<small>you have visited this page '+ item.count  + ' times</small></i>';

        li.innerHTML = time + itemContentWrapper + title + link + visits + '</div>';
        li.className = "historyItem";
        return li;
    }
    
    updateStorage(e){

        if(!itemList.length)
            return;

        //sort the list by number of visists
        // itemList.sort((a, b)=>b.count-a.count);

        //store in local storage
        storage.set('history', itemList, function(error) {
            if (error) throw error;
        });
    }

}

module.exports = History;
