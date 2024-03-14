import { string, z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const kriteriaKKESchema = z.object({
  id: z.string().min(1),
  kode: z.string().min(1),
  nama: z.string().min(1),
  kelompokKriteriaKKEId: z.string().nullable()
})

export type kriteriaKKE = z.infer<typeof kriteriaKKESchema>
