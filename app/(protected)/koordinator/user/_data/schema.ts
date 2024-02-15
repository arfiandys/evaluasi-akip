import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const userSchema = z.object({
  id: z.string().min(1),
  email: z.string(),
  name: z.string(),
  role: z.string().min(1),
  unitKerjas: z.object({
    unitKerjaId: z.string().min(1),
    userId: z.string().min(1),
    assignedRole: z.string().min(1),
  }).array(),
  timEvaluasis: z.object({
    timEvaluasiId: z.string().min(1),
    userId: z.string().min(1),
    assignedRole: z.string().min(1),
  }).array(),
})

export type User = z.infer<typeof userSchema>
