'use strict';
const {app,BrowserWindow}=require('electron');const path=require('node:path');
function createWindow(){
  const win=new BrowserWindow({width:1280,height:860,minWidth:360,minHeight:600,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith('file://'))event.preventDefault();});
  win.loadFile(path.join(__dirname,'../www/index.html'));
}
app.whenReady().then(()=>{createWindow();app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)createWindow();});});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
