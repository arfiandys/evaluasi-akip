import { min } from "date-fns"
import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const IKUSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  evaluasiId: z.string().min(1),
  tujuanSasaranIndikatorIKU: z.object({
    id: z.string().min(1),
    nama: z.string().min(1),
    kode: z.string().min(1),
    jenis: z.string().min(1),
  }).array()
})

export type IKU = z.infer<typeof IKUSchema>
