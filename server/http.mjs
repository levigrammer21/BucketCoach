import http from 'node:http';import {readFile,stat} from 'node:fs/promises';import path from 'node:path';import {randomBytes,timingSafeEqual} from 'node:crypto';import {AppError,publicJob} from './links.mjs';
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.zip':'application/zip'};
const PUBLIC=new Set(['index.html','style.css','app.js','backend.js','core.js','seed.js','icon.svg','manifest.webmanifest','sw.js','Bucket-Coach-v1.0.0.zip','Bucket-Coach-v1.1.0.zip','Bucket-Coach-Companion.zip']);
export function createServer({browser,collector,store,publicDir,mode='live'}){let csrf=randomBytes(32).toString('hex');
 const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))};
 async function body(req){let bytes=0,parts=[];for await(let part of req){bytes+=part.length;if(bytes>10*1024*1024)throw new AppError('Request is too large.','TOO_LARGE',413);parts.push(part)}try{return JSON.parse(Buffer.concat(parts).toString('utf8')||'{}')}catch{throw new AppError('Invalid request data.','INVALID_JSON')}}
 const authorized=req=>{let t=req.headers['x-bucket-coach'];if(typeof t!=='string'||t.length!==csrf.length)return false;return timingSafeEqual(Buffer.from(t),Buffer.from(csrf))};
 const server=http.createServer(async(req,res)=>{let url=new URL(req.url,'http://localhost');try{
  if(url.pathname.startsWith('/api/')){
   const origin=req.headers.origin;if(origin){let expected=req.headers['x-forwarded-host']||req.headers.host;try{if(new URL(origin).host!==expected)throw Error()}catch{throw new AppError('This request must come from Bucket Coach.','ORIGIN_MISMATCH',403)}}
   if(req.method==='GET'&&url.pathname==='/api/health'){return json(res,200,{ok:true,version:'1.1.0',mode,csrf,serverTime:new Date().toISOString()})}
   if(!authorized(req))throw new AppError('Reload Bucket Coach to reconnect to the server.','SESSION_TOKEN_REQUIRED',403);
   if(req.method==='GET'&&url.pathname==='/api/workspace')return json(res,200,store.snapshot());
   if(req.method==='PUT'&&url.pathname==='/api/workspace'){let b=await body(req);return json(res,200,await store.put(b.state,b.revision))}
   if(req.method==='GET'&&url.pathname==='/api/session')return json(res,200,await browser.status());
   if(req.method==='POST'&&url.pathname==='/api/session/start'){if(collector.activeId)throw new AppError('Pause the active scout before changing the browser.','SCOUT_BUSY',409);let b=await body(req);return json(res,200,await browser.start(+b.width||540))}
   if(req.method==='GET'&&url.pathname==='/api/session/frame'){if(collector.activeId)throw new AppError('Scouting is running. The connection view will be available if sign-in is needed.','SCOUT_BUSY',409);let bytes=await browser.frame();res.writeHead(200,{'Content-Type':'image/jpeg','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});return res.end(bytes)}
   if(req.method==='POST'&&url.pathname==='/api/session/action'){if(collector.activeId)throw new AppError('Scouting is using the browser. Stop the scout before interacting.','SCOUT_BUSY',409);return json(res,200,await browser.act(await body(req)))}
   if(req.method==='DELETE'&&url.pathname==='/api/session'){if(collector.activeId)throw new AppError('Stop the scout before signing out.','SCOUT_BUSY',409);await browser.reset();return json(res,200,{ok:true})}
   if(req.method==='POST'&&url.pathname==='/api/scout'){let b=await body(req);return json(res,202,publicJob(await collector.create(b)))}
   if(req.method==='GET'&&url.pathname==='/api/jobs'){return json(res,200,{activeId:collector.activeId,jobs:[...store.jobs.values()].slice(-20).reverse().map(publicJob)})}
   let match=url.pathname.match(/^\/api\/jobs\/([\w-]+)(?:\/(resume|stop))?$/);if(match){let job=store.jobs.get(match[1]);if(!job)throw new AppError('Scout not found.','JOB_NOT_FOUND',404);if(req.method==='GET'&&!match[2])return json(res,200,publicJob(job));if(req.method==='POST'&&match[2]==='resume')return json(res,202,publicJob(await collector.resume(job)));if(req.method==='POST'&&match[2]==='stop'){await collector.stop(job);return json(res,200,publicJob(job))}}
   throw new AppError('API route not found.','NOT_FOUND',404)
  }
  if(req.method!=='GET'&&req.method!=='HEAD')throw new AppError('Method not allowed.','METHOD_NOT_ALLOWED',405);let name=decodeURIComponent(url.pathname.replace(/^\//,''))||'index.html';if(!PUBLIC.has(name))throw new AppError('Page not found.','NOT_FOUND',404);let file=path.join(publicDir,name);let data;try{data=await readFile(file)}catch{throw new AppError('Page not found.','NOT_FOUND',404)}res.writeHead(200,{'Content-Type':TYPES[path.extname(name)]||'application/octet-stream','Cache-Control':name==='sw.js'?'no-cache':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'SAMEORIGIN'});res.end(req.method==='HEAD'?undefined:data)
 }catch(e){if(res.headersSent){res.end();return}let known=e instanceof AppError;json(res,known?e.status:500,{error:known?e.message:'The browser or server operation failed. Check the connection window and retry.',code:known?e.code:'INTERNAL_ERROR'})}});
 server.requestTimeout=60000;server.headersTimeout=65000;return server;
}
