import type { Request, Response } from "express";
import type { TeamIdParamInput, TeamInput } from "../schemas/team.schema.js";
import { createTeamService, deleteTeamService, getTeamByIdService } from "../services/team.service.js";

export const createTeamHandler = async (req: Request, res: Response) => {
    try {
        const { teamName, budget } = req.body as TeamInput;
        const team = await createTeamService(teamName, budget);
        if (team === null) {
            return res.status(500).json("error server");
        } else if (team === "duplicate") {
            return res.status(409).json(`Team: '${teamName}' already exists`);
        } else {
            return res.status(201).json(team);
        }
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
};

export const getTeamByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as TeamIdParamInput;

        const team = await getTeamByIdService(id);

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
};

export const deleteTeamHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as TeamIdParamInput;

        const deletedTeam = await deleteTeamService(id);

        if (!deletedTeam) {
            return res.status(500).json("error server");
        }

        if (deletedTeam.deletedCount == 0) {
            return res.status(404).json(`team not found`);
        }
        return res.status(200).json(`team deleted successfully`);
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
};
