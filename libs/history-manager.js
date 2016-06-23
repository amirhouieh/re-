/**
 * Created by amir on 26/05/16.
 */

const _ = require('lodash');
const storage = require('electron-json-storage');
// const HistoryItem = require('./history-item');
var itemList = [];

const titleRegex = /<title[^>]*>([^<]+)<\/title>/;

class HistoryItem{

    constructor(url,title){
        this.url = url.toLowerCase();
        this.title = title.toLowerCase();
        this.count = 0;
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

        if(!_html)
            return;

        url = url.toLowerCase().trim();

        let title = _html.match(titleRegex)[1];
        let itemInHistory = itemList.filter((item)=>item.url==url);

        //if the url is not already in history
        if( !itemInHistory.length )
            itemList.push(new HistoryItem(url,title));

        //otherwise we only increase the count
        else
            itemInHistory[0].count += 1;

    }

    getList(){
        return itemList;
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
