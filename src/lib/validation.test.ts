import { describe, expect, it } from "vitest";
import { containsSensitiveInfo, submissionSchema } from "@/lib/validation";
describe("submission validation",()=>{
  it("accepts a properly consented story",()=>{expect(submissionSchema.safeParse({story:"I spent twenty minutes looking for my glasses while wearing them.",category:"miscellaneous-regrets",anonymous:true,consent:true}).success).toBe(true)});
  it("rejects stories below the minimum length",()=>{expect(submissionSchema.safeParse({story:"Too short",category:"miscellaneous-regrets",consent:true}).success).toBe(false)});
  it("detects common private contact details",()=>{expect(containsSensitiveInfo("Call me at +1 (415) 555-0199")).toBe(true);expect(containsSensitiveInfo("My lunch was cold")).toBe(false)});
});
