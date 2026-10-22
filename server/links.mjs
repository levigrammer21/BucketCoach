export class AppError extends Error {constructor(message,code='REQUEST_FAILED',status=400){super(message);this.code=code;this.status=status}}
export function parseGameChangerLink(input){let text=String(input||'').trim(),found=text.match(/https:\/\/[^\s<>"']+/);let u;try{u=new URL(found?found[0]:text)}catch{throw new AppError('Paste the GameChanger team or game share link.','INVALID_LINK')}
 if(u.protocol!=='https:'||u.hostname!=='web.gc.com'||u.username||u.password||u.port)throw new AppError('Use the team or game link beginning https://web.gc.com/teams/.','INVALID_LINK');
 const parts=u.pathname.split('/').filter(Boolean);if(parts[0]!=='teams'||!parts[1]||!/^[a-zA-Z0-9_-]+$/.test(parts[1]))throw new AppError('This link does not identify a GameChanger team.','INVALID_LINK');
 let ix=parts.indexOf('schedule'),gameId=ix>=0&&parts[ix+1]?parts[ix+1]:null;
 return {url:u.origin+u.pathname.replace(/\/$/,''),teamId:parts[1],teamUrl:u.origin+'/teams/'+parts[1],gameId};
}
export function allowedBrowserURL(raw){try{let u=new URL(raw);return u.protocol==='https:'&&['web.gc.com','gc.com','www.gc.com'].includes(u.hostname)}catch{return false}}
export function publicJob(job){if(!job)return null;return {id:job.id,status:job.status,message:job.message,total:job.total,completed:job.completed,readableGames:job.readableGames,targetTeamId:job.targetTeamId,sourceUrl:job.sourceUrl,scope:job.scope,issues:job.issues,gamesCollected:job.games.length,updatedAt:job.updatedAt,appliedRevision:job.appliedRevision||null,teamName:job.teamName||null}}
