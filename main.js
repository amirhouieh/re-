const {ipcMain,BrowserWindow,app} = require('electron');

var mainWindow = null;
var chromeWindow = null;


app.on('window-all-closed', function() {
  app.quit();
});


ipcMain.on('url-to-chrome', (event, arg) => {
    //this will send the message to chrome itself;
    // event.sender.send('url-to-chrome', arg);
    if(chromeWindow)
        chromeWindow.webContents.send('url-to-chrome', arg);
});


app.on('ready', function() {

    let screenSize = require('electron').screen.getPrimaryDisplay().workAreaSize

    let width = (screenSize.width/2)-10;
    let height = screenSize.height-250;

    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        x: width+10,
        y: 100,
        icon:  __dirname + '/icon.png',
        autoHideMenuBar: true,
        // frame: false
    });

    // chromeWindow  = new BrowserWindow({
    //     width: width,
    //     height: height,
    //     x: 0,
    //     y: 100
    // });

    // chromeWindow.loadURL('file://' + __dirname + '/chrome.html');
    mainWindow.loadURL('file://' + __dirname + '/browser.html');

    // chromeWindow.setIgnoreMouseEvents(true)
    // chromeWindow.openDevTools();
    mainWindow.openDevTools();

});



// const {BrowserWindow,app} = require('electron');
// const main = require('electron-process').main;
//
// let mainWindow = null;
//
// app.on('ready', function() {
//     const backgroundURL = 'file://' + __dirname + '/renderer.html';
//     const backgroundProcessHandler = main.createBackgroundProcess(backgroundURL,true);
//     mainWindow = new BrowserWindow({width: 500, height: 600,x:600,y:100});
//     backgroundProcessHandler.addWindow(mainWindow);
//     mainWindow.loadURL('file://' + __dirname + '/browser.html');
// });
