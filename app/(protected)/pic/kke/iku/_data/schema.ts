import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const VariabelIKUUnitKerjaSchema = z.object({
  tahun: z.number().min(1),
  jenisIsian: z.string().min(1),
  isianKt: z.string().nullable(),
  isianAt: z.string().nullable(),
  isianDalnis: z.string().nullable(),
  isianPIC: z.string().nullable(),
  tujuanSasaranIndikatorIKUVariabelKKEId: z.string(),
  unitKerjaId: z.string(),
  tujuanSasaranIndikatorIKUVariabelKKE: z.object({
    id: z.string().min(1),
    jenisIKU: z.string().min(1),
    variabelKKEId: z.string().nullable(),
    variabelKKE: z.object({
      id: z.string().min(1),
      kode: z.string().min(1),
      nama: z.string().min(1),
      jenisIsian: z.string().min(1),
      variabelLKEId: z.string().nullable(),
    }).nullable(),
    tujuanSasaranIndikatorIKUId: z.string(),
    tujuanSasaranIndikatorIKU: z.object({
      id: z.string().min(1),
      kode: z.string().min(1),
      nama: z.string().min(1),
      jenis: z.string().min(1),
      IKUId: z.string().nullable(),
    }).nullable(),
  }),
  unitKerja: z.object({
    id: z.string().min(1),
    kodeWilayah: z.string().min(1),
    kodeUnitKerja: z.string().min(1),
    name: z.string().min(1),
  }),
})

export type VariabelIKUUnitKerja = z.infer<typeof VariabelIKUUnitKerjaSchema>
