import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/supabase";

export async function getAdminUser(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key||!adminDb)return null;
  const jar=await cookies();
  const client=createServerClient(url,key,{cookies:{getAll(){return jar.getAll()},setAll(values:{name:string;value:string;options:CookieOptions}[]){try{values.forEach(({name,value,options})=>jar.set(name,value,options))}catch{/* Server component render cannot set cookies. */}}}});
  const {data:{user}}=await client.auth.getUser();
  if(!user)return null;
  const {data:role}=await adminDb.from("admin_roles").select("user_id").eq("user_id",user.id).maybeSingle();
  return role?user:null;
}
