'use strict';
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');
fs.rmSync(path.join(__dirname,'www'),{recursive:true,force:true});
fs.cpSync(path.join(root,'site'),path.join(__dirname,'www'),{recursive:true});
console.log('Copied the current HGW website into the app packaging directory.');
