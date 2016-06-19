const {ipcRenderer} = require('electron');
ipcRenderer.on('url-to-chrome', function(event, arg){
    console.log('I am chrome and get this shit', arg);
});


onload = function() {

    let chrome = document.getElementById('chrome');

    ipcRenderer.on('url-to-chrome', function(event, arg){
        console.log('I am chrome and get this shit', arg);
        chrome.loadURL(arg);
    });
    
}
