const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.argv[2],{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
await p.pdf({path:process.argv[3],format:'A4',printBackground:true,displayHeaderFooter:false,
 headerTemplate:'<span></span>',
 footerTemplate:'<div style="width:100%;font-size:7px;font-family:monospace;color:#6E6050;padding:0 16mm;display:flex;justify-content:space-between"><span>Zwergenladen · Der Zwergenwald</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
 margin:{top:'0',bottom:'0',left:'0',right:'0'}});
console.log('errs',errs);await b.close();})();
