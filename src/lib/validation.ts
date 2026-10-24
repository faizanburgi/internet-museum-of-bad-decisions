import { z } from "zod";
import { categories } from "@/lib/categories";

export const submissionSchema = z.object({
  story: z.string().trim().min(30, "Your story needs at least 30 characters.").max(1000, "Keep your story under 1,000 characters."),
  category: z.enum(categories.map((item) => item.slug) as [string, ...string[]]),
  displayName: z.string().trim().max(50).optional().default(""),
  anonymous: z.boolean().default(true),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm your story is safe to share." }) }),
  title: z.string().trim().max(90).optional().default("")
});

export function containsSensitiveInfo(text: string) {
  return /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b|\b(?:\+?\d[\d ().-]{7,}\d)\b/.test(text);
}
