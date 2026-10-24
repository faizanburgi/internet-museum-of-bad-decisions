"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function login(form:FormData){const email=String(form.get("email")||""),password=String(form.get("password")||"");const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;if(!url||!key)redirect("/admin/login?error=configuration");const jar=await cookies();const client=createServerClient(url!,key!,{cookies:{getAll(){return jar.getAll()},setAll(values){values.forEach(({name,value,options})=>jar.set(name,value,options))}}});const {error}=await client.auth.signInWithPassword({email,password});if(error)redirect("/admin/login?error=credentials");redirect("/admin")}
