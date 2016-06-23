/**
 * Created by amir on 26/05/16.
 */

class HistoryItem{

    constructor(url,title){
        this.url = url.toLowerCase();
        this.title = title.toLowerCase();
        this.count = 0;
    }

    updateVisitCount(){
        this.count++;
    }
    
}

module.exports= HistoryItem;
