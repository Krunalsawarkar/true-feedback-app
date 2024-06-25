import { z } from "zod";

export const acceptSchema = z.object({
  acceptMsg: z.boolean(),
});
