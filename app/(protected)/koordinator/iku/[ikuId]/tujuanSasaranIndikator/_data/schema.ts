import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const tujuanSasaranIndikatorIKUSchema = z.object({
  id: z.string().min(1),
  nama: z.string().min(1),
  kode: z.string().min(1),
  jenis: z.string().min(1),
})

export type TujuanSasaranIndikatorIKU = z.infer<typeof tujuanSasaranIndikatorIKUSchema>
