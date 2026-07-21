import { Router, type Request, type Response } from "express";
import { createTeam, getTeamById } from "../repositories/team.repository.js";
import { validateTeamIdParamRequest, validateTeamRequest } from "../middlewares/TeamValidate.middleware.js";
import { teamIdParamSchema, teamSchema, type TeamIdParamInput, type TeamInput } from "../schemas/team.schema.js";

const teamRouter = Router();

// POST /teams - Create team
teamRouter.post("/", validateTeamRequest(teamSchema), async (req: Request, res: Response) => {
    try {
        const { teamName, budget } = req.body as TeamInput;
        const team = await createTeam(teamName, budget);
        if (team === undefined) {
            return res.status(500).json("error server");
        } else {
            return res.status(201).json(team);
        }
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
});

// GET /teams/:id - Get team by ID
teamRouter.get("/:id", validateTeamIdParamRequest(teamIdParamSchema), async (req: Request, res: Response) => {
    try {
        const { id } = req.params as TeamIdParamInput;
        if (!id || typeof id !== "string") {
            return res.status(400).json("Invalid or missing ID");
        }

        const team = await getTeamById(id);

        if (team === undefined) {
            return res.status(500).json("error server");
        } else if (team === null) {
            return res.status(404).json("team not found");
        } else {
            return res.status(200).json(team);
        }
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
});

export default teamRouter;
