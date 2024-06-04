import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const variabelIKUSchema = z.object({
  id: z.string().min(1),
  tujuanSasaranIndikatorIKUId: z.string().nullable(),
  variabelKKEId: z.string().nullable(),
  variabelKKE: z.object({
    id: z.string().min(1),
    kode: z.string().min(1),
    jenisIsian: z.string().min(1),
    kriteriaKKE: z.object({
      id: z.string().min(1),
      nama: z.string().min(1),
    }).nullable(),
  }).nullable(),
  tujuanSasaranIndikatorIKU: z.object({
    id: z.string().min(1),
    kode: z.string().min(1),
    nama: z.string().min(1),
    jenis: z.string().min(1),
    IKU: z.object({
      id: z.string().min(1),
      name: z.string().min(1),
    }).nullable(),
  }).nullable(),
})

export type VariabelIKU = z.infer<typeof variabelIKUSchema>
