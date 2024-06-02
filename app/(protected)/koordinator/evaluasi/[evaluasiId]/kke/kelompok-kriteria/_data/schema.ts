import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const kelompokKriteriaSchema = z.object({
  id: z.string().min(1),
  kode: z.string().min(1),
  name: z.string().min(1),
  evaluasiId: z.string().min(1),
  kriteriaKKE: z.object({
    id: z.string().min(1),
    kode: z.string().min(1),
    nama: z.string().min(1),
  }).array()
})

export type KelompokKriteria = z.infer<typeof kelompokKriteriaSchema>
