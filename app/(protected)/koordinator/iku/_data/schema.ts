import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const IKUSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tahun: z.string().min(1),
})

export type IKU = z.infer<typeof IKUSchema>
