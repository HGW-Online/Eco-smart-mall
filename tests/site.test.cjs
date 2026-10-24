'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=path.resolve(__dirname,'..','site');
const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const css=fs.readFileSync(path.join(base,'styles.css'),'utf8');
const app=fs.readFileSync(path.join(base,'app.js'),'utf8');
test('site contains required entrypoints and visible demo disclaimer',()=>{
 assert.match(html,/src="\.\/app\.js"/);
 assert.match(html,/href="\.\/styles\.css"/);
 assert.match(html,/id="view"/);
 assert.match(html,/id="dialog"/);
 assert.match(html,/لا تتصل بـ Glide/);
});
test('styles provide responsive layout and RTL support',()=>{
 assert.match(css,/@media\(max-width:820px\)/);
 assert.match(html,/dir="rtl"/);
});
test('app has order state transitions and protection against double stock return',()=>{
 assert.match(app,/function transition\(id,action\)/);
 assert.match(app,/if\(o\.reserved\)/);
 assert.match(app,/o\.reserved=false/);
 assert.match(app,/o\.status='cancelled'/);
 assert.match(app,/if\(!db\.cart\.every/);
});
test('app has bilingual navigation and local demo reset',()=>{
 assert.match(app,/document\.documentElement\.dir/);
 assert.match(app,/localStorage\.setItem/);
 assert.match(app,/action==='reset'/);
 assert.match(app,/voteYes/);
});
test('no payment processor or remote network requests in prototype',()=>{
 assert.doesNotMatch(app,/\bfetch\s*\(/);
 assert.doesNotMatch(app,/\bXMLHttpRequest\b/);
 assert.doesNotMatch(app,/\bstripe\b|\bpaypal\b/i);
});
