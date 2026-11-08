const fs=require('node:fs');
const cp=require('node:child_process');
const assert=require('node:assert/strict');
const before=cp.execFileSync('git',['-c','safe.directory=D:/me/gameboy/battery-panic','show','0794f8c48a21686081acd4598b845cd4d85a81cf:index.html'],{encoding:'utf8'}).replace(/\r\n/g,'\n');
const after=fs.readFileSync('battery_panic.html','utf8').replace(/\r\n/g,'\n');
for(const tag of ['style','script']){
 const re=new RegExp('<'+tag+'[^>]*>[\\s\\S]*?</'+tag+'>','g');
 assert.deepEqual(after.match(re),before.match(re),'Original '+tag+' preserved exactly');
}
assert.ok(after.includes("localStorage.getItem('battery-panic-best')"));
console.log('PASS: Battery Panic original inline CSS, JavaScript, and saved-score key are unchanged.');
