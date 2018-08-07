const electron = require("electron");
const path = require("path");
const url = require("url");

const app = electron.app;
const BW = electron.BrowserWindow;


app.on('ready',function(){
  mw = new BW({width:1024, height: 765, background:'#FFFFFF'});
  //mw.loadURL("https://google.es");
  mw.loadURL(url.format({
    pathname: path.join(__dirname, "main/index.html"),
    protocol: "file",
    slaches: true
  }))

  mw.webContents.openDevTools()
  mw.maximize()
  mw.setMenu(null)
});

var testfnc=function(){
  console.log("hola mundo");
}
