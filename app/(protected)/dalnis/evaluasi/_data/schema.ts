import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const evaluasiSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable(),
  tahun: z.string().min(1),
})

export type Evaluasi = z.infer<typeof evaluasiSchema>
