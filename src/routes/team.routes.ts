import { Router } from "express";
import { createTeamHandler, deleteTeamHandler, getTeamByIdHandler } from "../controllers/team.controller.js";
import { validateRequest } from "../middlewares/RequestValidate.middleware.js";
import { teamIdParamSchema, teamSchema } from "../schemas/team.schema.js";

const teamRouter = Router();

// POST /teams - Create team
teamRouter.post("/", validateRequest(teamSchema), createTeamHandler);

// GET /teams/:id - Get team by ID
teamRouter.get("/:id", validateRequest(teamIdParamSchema), getTeamByIdHandler);

// DELETE /teams/:id - Delete team by ID
teamRouter.delete("/:id", validateRequest(teamIdParamSchema), deleteTeamHandler);

export default teamRouter;
