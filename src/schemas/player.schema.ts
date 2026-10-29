import { z } from "zod";

export const playerSchema = z.object({
    playerId: z.number().positive().max(1000000000, "PlayerId too high"),
    firstName: z
        .string()
        .min(2, "Player firstName must be at least 2 characters")
        .max(40, "Player firstName must be at most 40 characters"),
    lastName: z
        .string()
        .min(2, "Player firstName must be at least 2 characters")
        .max(40, "Player firstName must be at most 40 characters"),
    nationality: z
        .string()
        .min(2, "Player nationality must be at least 2 characters")
        .max(20, "Player nationality must be at most 40 characters"),
    jerseyNumber: z.number().min(0, "jerseyNumber cannot be negative").max(100, "jerseyNumber too high"),
    cost: z.number().min(0, "cost cannot be negative").max(1000000000, "cost too high"),
    team: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid team ObjectId"),
});

export const playerIdParamSchema = z.object({
    playerId: z.coerce.number().min(0, "PlayerId cannot be negative").max(1000000000, "PlayerId too high"),
});

export const teamIdParamSchema = z.object({
    teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid team ObjectId"),
});

export const addPlayerToTeamSchema = z.object({
    playerId: z.number().min(0, "PlayerId cannot be negative").max(1000000000, "PlayerId too high"),
    teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid team ObjectId"),
});

export const searchPlayerQuerySchema = z.object({
    name: z.string().min(1, "Search name is required").max(40, "Search name must be at most 40 characters"),
});

export const jerseyParamSchema = z.object({
    teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid team ObjectId"),
    jerseyNum: z.coerce.number().min(0, "jerseyNumber cannot be negative").max(100, "jerseyNumber too high"),
});

export type PlayerInput = z.infer<typeof playerSchema>;
export type PlayerIdParamInput = z.infer<typeof playerIdParamSchema>;
export type TeamIdParamInput = z.infer<typeof teamIdParamSchema>;
export type AddPlayerToTeamInput = z.infer<typeof addPlayerToTeamSchema>;
export type SearchPlayerQueryInput = z.infer<typeof searchPlayerQuerySchema>;
export type JerseyParamInput = z.infer<typeof jerseyParamSchema>;
