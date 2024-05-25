import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const VariabelKKEUnitKerjaSchema = z.object({
  isianKt: z.string().nullable(),
  isianAt: z.string().nullable(),
  isianDalnis: z.string().nullable(),
  isianPIC: z.string().nullable(),
  variabelKKEId: z.string(),
  unitKerjaId: z.string(),
  variabelKKE: z.object({
    id: z.string().min(1),
    evaluasiId: z.string().min(1),
    kode: z.string().min(1),
    tahun: z.string().min(1),
    jenisIsian: z.string().min(1),
    isIndikatorKinerja: z.boolean(),
    variabelLKEId: z.string().min(1),
    kriteriaKKEId: z.string().nullable(),
    kriteriaKKE: z.object({
      id: z.string().min(1),
      kode: z.string().min(1),
      nama: z.string().min(1),
      kelompokKriteriaKKEId: z.string().nullable(),
      kelompokKriteriaKKE: z.object({
        permindokId: z.string().nullable()
      })
    }).nullable(),
    evaluasi: z.object({
      id: z.string().min(1),
      status: z.string().min(1),
    }).nullable(),
  }),
  unitKerja: z.object({
    id: z.string().min(1),
    kodeWilayah: z.string().min(1),
    kodeUnitKerja: z.string().min(1),
    name: z.string().min(1),
    permindoks: z.object({
      url: z.string().nullable(),
      nameDokumen: z.string().nullable(),
      permindokId: z.string(),
      unitKerjaId: z.string(),
    }).array()
  }),
})

export type VariabelKKEUnitKerja = z.infer<typeof VariabelKKEUnitKerjaSchema>
