import { z } from "zod";

export const playerSchema = z.object({
    playerId: z.number().min(0, "PlayerId cannot be negative").max(1000000000, "PlayerId too high"),
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

export type PlayerInput = z.infer<typeof playerSchema>;
