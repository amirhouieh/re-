const {ipcMain,BrowserWindow,app} = require('electron');
const io = require('socket.io-client');

app.on('window-all-closed', function() {
  app.quit();
});



const chromeApp = {
    ip:'http://192.168.1.4',
    port:'3000'
};

const msgList = {
    URL: 'url-for-chrome',
    VIDEO: 'video',
    CONNECTION: 'connection-success'
};

//connect to chrome app
const socket = io.connect(chromeApp.ip + ":" + chromeApp.port);
//connect to chrome app success callback
socket.on('connect',()=>socket.emit(msgList.CONNECTION, 're- is connected to chrome'));
//get url from browser and pass to chrome app
ipcMain.on('url-to-chrome', (event, arg) => socket.emit(msgList.URL,arg));



app.on('ready', function() {

    const mainWindow = new BrowserWindow({
        icon:  __dirname + '/icon.png',
        autoHideMenuBar: true,
        // frame: false
    });

    mainWindow.loadURL('file://' + __dirname + '/browser.html');
    mainWindow.openDevTools();

});
