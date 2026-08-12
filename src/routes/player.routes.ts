import { Router } from "express";
import { createPlayerHandler } from "../controllers/player.controller.js";

export const playerRouter = Router();

// POST /players - Create player
playerRouter.post("/", createPlayerHandler)
