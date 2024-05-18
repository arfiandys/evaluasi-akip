import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const permindokUnitKerjaSchema = z.object({
  url: z.string().nullable(),
  nameDokumen: z.string().nullable(),
  permindokId: z.string(),
  unitKerjaId: z.string(),
  permindok: z.object({
    id: z.string().min(1),
    kode: z.string().min(1),
    tahun: z.string().min(1),
    name: z.string().min(1),
  }),
  unitKerja: z.object({
    id: z.string().min(1),
    kodeWilayah: z.string().min(1),
    kodeUnitKerja: z.string().min(1),
    name: z.string().min(1),
  }),
})

export type permindokUnitKerja = z.infer<typeof permindokUnitKerjaSchema>
