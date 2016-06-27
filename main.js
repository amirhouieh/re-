const {ipcMain,BrowserWindow,app} = require('electron');
const io = require('socket.io-client');

app.on('window-all-closed', function() {
  app.quit();
});



const chromeApp = {
    // ip:'http://192.168.1.4',
    ip: 'http://localhost',
    port:'3000'
};

const msgList = {
    DEFAULT: 'url-for-chrome',
    VIDEO: 'video',
    CONNECTION: 'connection-success',
    HOME: 'homepage'
}

//connect to chrome app
const socket = io.connect(chromeApp.ip + ":" + chromeApp.port);
//connect to chrome app success callback
socket.on('connect',(event,msg)=>{
    console.log('re- is connected to server');
});

//get url from browser and pass to chrome app
ipcMain.on(msgList.CONNECTION, (event, msg) =>socket.emit(msgList.CONNECTION));
ipcMain.on(msgList.DEFAULT, (event, url) => socket.emit(msgList.DEFAULT,url));
ipcMain.on(msgList.VIDEO, (event, arg) => socket.emit(msgList.VIDEO));
ipcMain.on(msgList.HOME, (event, arg) =>socket.emit(msgList.HOME));


app.on('ready', function() {

    const mainWindow = new BrowserWindow({
        icon:  __dirname + '/icon.png',
        autoHideMenuBar: true,
        // frame: false
    });

    mainWindow.loadURL('file://' + __dirname + '/browser.html');
    mainWindow.openDevTools();

});
