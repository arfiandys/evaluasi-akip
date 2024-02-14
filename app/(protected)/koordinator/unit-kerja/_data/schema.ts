import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const unitKerjaSchema = z.object({
  id: z.string().min(1),
  kodeWilayah: z.string().min(1),
  kodeUnitKerja: z.string().min(1),
  name: z.string().min(1),
  userId: z.string().min(1),
  users: z.object({
    unitKerjaId: z.string().min(1),
    userId: z.string().min(1),
    assignedRole: z.string().min(1),
  }).array(),
})

export type unitKerja = z.infer<typeof unitKerjaSchema>
