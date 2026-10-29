'use strict';
const fs=require('node:fs');const path=require('node:path');
const site=path.resolve(__dirname,'../site');const config=JSON.parse(fs.readFileSync(path.join(site,'section-routes.json'),'utf8'));const template=fs.readFileSync(path.join(site,config.entry),'utf8');
for(const route of config.routes){if(!/^[a-z0-9-]+$/.test(route))throw new Error('Invalid route');fs.writeFileSync(path.join(site,route+'.html'),template.replace('data-section="allprojects"','data-section="'+route+'"').replace('<title>HGW | Global Platform</title>','<title>HGW | '+route+'</title>'));}
console.log('Prepared '+config.routes.length+' independent section pages.');
