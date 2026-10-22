// Runs in the remote GameChanger page. Reads rendered DOM only.
export function readGameChangerPage({action,name='',opponent='',year=2026}={}){
 const clean=s=>(s||'').replace(/\s+/g,' ').trim();
 const visible=e=>{if(!e||!e.getClientRects().length)return false;for(let p=e;p&&p!==document;p=p.parentElement){const s=getComputedStyle(p);if(s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity)===0||p.getAttribute('aria-hidden')==='true'||/blur\((?!0(?:px)?\))/.test(s.filter))return false}return true};
 const text=document.body?.innerText||'',lines=text.split('\n').map(clean).filter(Boolean);
 const blocked=/verify (?:that )?you are human|checking your browser|unusual (?:traffic|activity)|automated (?:traffic|queries)|access denied.{0,80}(?:bot|security|automation)/i.test(text);
 const accountError=/couldn.t load your account|unable to load your account/i.test(text);
 const loginFields=[...document.querySelectorAll('input')].filter(e=>visible(e)&&['email','password'].includes(e.type));
 const signInVisible=[...document.querySelectorAll('button,a')].some(e=>visible(e)&&/^sign\s*in$/i.test(clean(e.innerText)));
 const links=[...document.querySelectorAll('a[href]')].filter(visible).map(a=>({text:clean(a.innerText),url:a.href}));
 const ownTeamId=location.pathname.split('/').filter(Boolean)[1];let ownTeamLink=links.find(a=>{try{return new URL(a.url).pathname.replace(/\/$/,'')==='/teams/'+ownTeamId&&a.text}catch{return false}});
 let recordIndex=lines.findIndex(l=>/^\d+\s*[-–]\s*\d+(?:\s*[-–]\s*\d+)?\s+(?:Fall|Spring|Summer|Winter|20\d\d)/i.test(l));
 let inferred=ownTeamLink?.text||(recordIndex>0?lines[recordIndex-1]:'');
 if(!inferred){let headings=[...document.querySelectorAll('h1,h2')].filter(visible).map(e=>clean(e.innerText));inferred=headings.find(t=>t&&!/^schedule$|^home$|^recap$|^box score$|^oops/i.test(t))||''}
 let seasonYear=+((recordIndex>=0?lines[recordIndex]:'').match(/20\d\d/)?.[0]||year);
 const summary={url:location.href,title:document.title,teamName:inferred.slice(0,100),year:seasonYear,blocked,accountError,loginRequired:loginFields.length>0,signInVisible,signOutVisible:links.some(a=>/^sign out$|^log out$/i.test(a.text)),errorText:accountError?'GameChanger could not load your account.':blocked?'GameChanger is requesting human verification.':null};
 if(action==='summary')return summary;
 if(action==='schedule'){
  const months={Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
  const buttons=[...document.querySelectorAll('button,a')].filter(visible).filter(b=>/\b[WLT]\s+\d+\s*[-–]\s*\d+\b/.test(b.innerText));
  let games=buttons.slice(0,150).map((b,index)=>{let label=clean(b.innerText),m=label.match(/\b([WLT])\s+(\d+)\s*[-–]\s*(\d+)\b/),other=label.slice(0,m.index).replace(/^@\s*/,'').trim(),parent=b.parentElement,date=null;for(let j=0;parent&&j<5;j++,parent=parent.parentElement){let t=clean(parent.innerText),d=t.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})(?:,?\s+(20\d\d))?/);if(d){date=(d[3]||seasonYear)+'-'+String(months[d[1]]).padStart(2,'0')+'-'+d[2].padStart(2,'0');break}}return {index,label,date,opponent:other,runs:+m[2],allowed:+m[3],url:b.tagName==='A'?b.href:null}});
  let scheduleLink=links.find(l=>/^schedule$|^view full schedule$/i.test(l.text));return {...summary,games,scheduleUrl:scheduleLink?.url||location.href,ready:games.length>0||/no (?:games|events)|schedule/i.test(text)};
 }
 if(action==='links')return {...summary,links,boxLink:links.find(a=>/^box\s*score$/i.test(a.text))?.url||null,playsLink:links.find(a=>/^plays$/i.test(a.text))?.url||null};
 if(action==='box'){
  const tables=[...document.querySelectorAll('table')],batting=[],pitching=[],issues=[];let labels=[name,opponent].filter(Boolean).map(clean);
  const labelBefore=table=>{let w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n,last='';while(n=w.nextNode()){if(table.contains(n))break;if(!visible(n.parentElement))continue;let t=clean(n.textContent);if(labels.includes(t))last=t}return last};
  let foundTables=0,lockedRows=0;
  for(let table of tables){const rows=[...table.querySelectorAll('tr')];if(!rows.length)continue;const headers=[...rows[0].querySelectorAll('th,td')].map(c=>clean(c.innerText).toUpperCase());if(!headers.includes('AB')&&!headers.includes('IP'))continue;foundTables++;const kind=headers.includes('AB')?'batting':'pitching';if(labelBefore(table)!==clean(name)){issues.push('Skipped a table whose team label could not be verified.');continue}const map={AB:'ab',R:'r',H:'h',RBI:'rbi',BB:'bb',SO:'so',K:'so',IP:'ip',ER:'er',BF:'bf',PC:'pitches','2B':'doubles','3B':'triples',HR:'hr',SB:'sb',CS:'cs',HBP:'hbp',SF:'sf'};
   for(let row of rows.slice(1)){const cells=[...row.querySelectorAll('td,th')];if(!cells.length)continue;if(!cells.every(visible)){lockedRows++;continue}let txt=clean(cells[0].innerText);if(!txt||/^TEAM\b|^TOTAL/i.test(txt))continue;let m=txt.match(/^(.*?)\s*#\s*(\S+?)(?:\s*\(([^)]+)\))?$/),p={name:m?m[1].trim():txt,number:m?m[2]:'',position:m?m[3]||'':''};for(let i=1;i<Math.min(cells.length,headers.length);i++){let v=clean(cells[i].innerText);if(map[headers[i]]&&/^\d+(?:\.\d+)?$/.test(v))p[map[headers[i]]]=+v}if(kind==='batting'&&p.ab==null)continue;if(kind==='pitching'&&p.ip==null)continue;(kind==='batting'?batting:pitching).push(p)}
  }
  if(lockedRows)issues.push('Skipped '+lockedRows+' blurred or hidden player rows.');return {...summary,batting,pitching,issues,locked:lockedRows>0,ready:foundTables>0||summary.loginRequired};
 }
 return summary;
}
export function clickScheduleGame({index,label}){const clean=s=>(s||'').replace(/\s+/g,' ').trim(),bs=[...document.querySelectorAll('button,a')].filter(e=>e.getClientRects().length).filter(b=>/\b[WLT]\s+\d+\s*[-–]\s*\d+\b/.test(b.innerText));let b=bs[index];if(!b||clean(b.innerText)!==label)return false;b.click();return true}
