var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;


app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {

  mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      icon:  __dirname + '/icon.png',
      autoHideMenuBar: true
  });

  mainWindow.loadURL('file://' + __dirname + '/browser.html');
  mainWindow.openDevTools();
});