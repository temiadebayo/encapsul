import { createHash } from 'node:crypto';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';
export async function POST(request:Request) {
 const headers={'Cache-Control':'no-store'};
 const origin=request.headers.get('origin');
 if(origin && origin!==new URL(request.url).origin) return Response.json({error:'Invalid origin'},{status:403,headers});
 if(!request.headers.get('content-type')?.includes('application/json')) return Response.json({error:'Expected JSON'},{status:415,headers});
 try {
  const raw=await request.text();
  if(raw.length>2048) return Response.json({error:'Request too large'},{status:413,headers});
  let body;try{body=JSON.parse(raw);}catch{return Response.json({error:'Invalid JSON'},{status:400,headers});}
  if(!body || typeof body!=='object')return Response.json({error:'Invalid request'},{status:400,headers});
  if(body.website) return Response.json({ok:true},{headers});
  const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
  if(email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['sending','travelling','both'].includes(body.interest) || typeof body.beta!=='boolean') return Response.json({error:'Invalid signup details'},{status:400,headers});
  const emailKey=createHash('sha256').update(email).digest('hex');
  await put(`waitlist/${emailKey}.json`,JSON.stringify({email,interest:body.interest,beta:body.beta,createdAt:new Date().toISOString()}),{
   access:'private',
   addRandomSuffix:false,
   allowOverwrite:false,
   contentType:'application/json',
  }).catch((error:unknown)=>{
   if(error instanceof Error && /already exists|conflict/i.test(error.message)) return;
   throw error;
  });
  return Response.json({ok:true},{headers});
 }catch{ return Response.json({error:'Signup temporarily unavailable'},{status:503,headers}); }
}
