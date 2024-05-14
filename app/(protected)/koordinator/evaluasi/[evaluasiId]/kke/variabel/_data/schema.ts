import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const variabelKKESchema = z.object({
  id: z.string().min(1),
  evaluasiId: z.string().min(1),
  kode: z.string().min(1),
  tahun: z.string().min(1),
  jenisIsian: z.string().min(1),
  jenisIsianIKU: z.string().nullable(),
  petunjukEvaluasi: z.string().nullable(),
  isIndikatorKinerja: z.boolean(),
  kriteriaKKEId: z.string().nullable(),
  variabelLKEId: z.string().nullable(),
  kriteriaKKE: z.object({
    id: z.string().min(1),
    kode: z.string().min(1),
    nama: z.string().min(1),
    kelompokKriteriaKKEId: z.string().nullable(),
  }).nullable(),
  variabelUnitKerja: z.object({
    isianPIC: z.string().nullable(),
    isianKt: z.string().nullable(),
    isianAt: z.string().nullable(),
    isianDalnis: z.string().nullable(),
    variabelKKEId: z.string().nullable(),
    unitKerjaId: z.string().nullable(),
  }).array(),
})

export type VariabelKKE = z.infer<typeof variabelKKESchema>
