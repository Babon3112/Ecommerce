import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().length(8, "verfication code must be in 8 digits"),
});
