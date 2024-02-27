import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const sasaranIKUSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kode: z.string().min(1),
  indikatorIKU: z.object({
    id: z.string().min(1),
    kode: z.string().min(1),
    name: z.string().min(1),
  }).array()
})

export type SasaranIKU = z.infer<typeof sasaranIKUSchema>
