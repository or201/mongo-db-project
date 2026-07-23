import { z } from "zod";

export const teamSchema = z.object({
    teamName: z.string().min(2, "Team name must be at least 2 characters").max(40, "Team name must be at most 40 characters"),
    budget: z.number().min(0, "Budget cannot be negative").max(1000000000, "Budget too high"),
});

export const teamIdParamSchema = z.object({
    id: z.string().length(24, "ID must be exactly 24 characters long"),
});

export type TeamInput = z.infer<typeof teamSchema>;
export type TeamIdParamInput = z.infer<typeof teamIdParamSchema>;