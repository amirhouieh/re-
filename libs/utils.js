/**
 * Created by amir on 26/05/16.
 */

module.exports.eachArr = function (arr,callback) {
    for(let x=0; x<arr.length; x++)
        callback(x,arr[x]);
}

module.exports.eachObj = function (obj,callback) {
    for(let x in obj)
        callback(x,obj[x]);
}

module.exports.guid = function(){

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
