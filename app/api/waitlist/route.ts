import { getDb } from '@/lib/db';
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
  await getDb().prepare('INSERT INTO waitlist (email, interest, beta, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO NOTHING').bind(email,body.interest,body.beta?1:0,new Date().toISOString()).run();
  return Response.json({ok:true},{headers});
 }catch{ return Response.json({error:'Signup temporarily unavailable'},{status:503,headers}); }
}
