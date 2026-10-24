import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { submissionSchema, containsSensitiveInfo } from "@/lib/validation";
import { adminDb, hasDatabase } from "@/lib/supabase";
import { curate } from "@/lib/curator";

const visits = new Map<string, { count: number; start: number }>();
export async function POST(request: Request) {
  const rawIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ip = createHash("sha256").update(`${process.env.RATE_LIMIT_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || "museum"}:${rawIp}`).digest("hex");
  const now = Date.now(); const prior = visits.get(ip);
  if (prior && now - prior.start < 60 * 60 * 1000 && prior.count >= 3) return NextResponse.json({ error: "The archives can only accept three submissions per hour from one visitor. Please try again later." }, { status: 429 });
  if (!prior || now - prior.start >= 60 * 60 * 1000) visits.set(ip, { count: 1, start: now }); else prior.count++;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Please submit a valid form." }, { status: 400 }); }
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check your submission." }, { status: 400 });
  if (containsSensitiveInfo(parsed.data.story)) return NextResponse.json({ error: "Please remove email addresses or phone numbers before submitting." }, { status: 400 });
  if (!hasDatabase || !adminDb) return NextResponse.json({ error: "The museum's archives are not connected yet. Please try again later." }, { status: 503 });
  // The edge-safe process bucket is a fallback only. Use the persistent PostgreSQL limiter in production.
  const limited = await adminDb.rpc("consume_submission_rate_limit", { visitor_hash: ip, maximum: 3, window_minutes: 60 });
  if (limited.error) return NextResponse.json({ error: "The archives could not verify submission limits. Please try again later." }, { status: 503 });
  if (limited.data !== true) return NextResponse.json({ error: "The archives can only accept three submissions per hour from one visitor. Please try again later." }, { status: 429 });
  const department = await adminDb.from("categories").select("id").eq("slug", parsed.data.category).single();
  if (department.error || !department.data) return NextResponse.json({ error: "Please choose a valid museum department." }, { status: 400 });
  const curated = await curate(parsed.data.story, parsed.data.title);
  const { data, error } = await adminDb.from("exhibits").insert({ category_id: department.data.id, original_story: parsed.data.story, curated_title: curated.title, curated_description: curated.description, public_display_name: parsed.data.anonymous ? null : parsed.data.displayName || null, is_anonymous: parsed.data.anonymous, classification: curated.classification, status: "pending" }).select("id, exhibit_number").single();
  if (error || !data) return NextResponse.json({ error: "The archives could not save your contribution. Please try again." }, { status: 500 });
  return NextResponse.json({ reference: data.id, exhibitNumber: data.exhibit_number, title: curated.title, description: curated.description });
}
