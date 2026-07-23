import { Router } from "express";
import { createTeamHandler, deleteTeamHandler, getTeamByIdHandler } from "../controllers/team.controller.js";
import { validateTeamIdParamRequest, validateTeamRequest } from "../middlewares/TeamValidate.middleware.js";
import { teamIdParamSchema, teamSchema } from "../schemas/team.schema.js";

const teamRouter = Router();

// POST /teams - Create team
teamRouter.post("/", validateTeamRequest(teamSchema), createTeamHandler);

// GET /teams/:id - Get team by ID
teamRouter.get("/:id", validateTeamIdParamRequest(teamIdParamSchema), getTeamByIdHandler);

// DELETE /teams/:id - Delete team by ID
teamRouter.delete("/:id", validateTeamIdParamRequest(teamIdParamSchema), deleteTeamHandler);

export default teamRouter;
