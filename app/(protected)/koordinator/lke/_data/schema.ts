import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const timEvaluasiSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  userId: z.string().min(1),
  users: z.object({
    timEvaluasiId: z.string().min(1),
    userId: z.string().min(1),
    assignedRole: z.string().min(1),
  }).array()
})

export type timEvaluasi = z.infer<typeof timEvaluasiSchema>
