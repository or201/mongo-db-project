import type { Request, Response } from "express";
import type { TeamIdParamInput, TeamInput } from "../schemas/team.schema.js";
import { createTeamService, deleteTeamService, getTeamByIdService } from "../services/team.service.js";
import { ApiError } from "../utils/ApiError.js";

export const createTeamHandler = async (req: Request<{}, {}, TeamInput >, res: Response) => {
    const { teamName, budget } = req.body
    const team = await createTeamService(teamName, budget);
    return res.status(201).json(team);
};

export const getTeamByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    const team = await getTeamByIdService(id);

    return res.status(200).json(team);
};

export const deleteTeamHandler = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    const deletedTeam = await deleteTeamService(id);
    
    return res.status(204).send();
};
