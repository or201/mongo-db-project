import type { DeleteResult } from "mongodb";
import { TEAMS_COLLECTION } from "../config/constants.js";
import { logger } from "../config/logger.js";
import type { Team } from "../models/team.model.js";
import { createTeamRepo, deleteTeamRepo, getTeamByIdRepo } from "../repositories/team.repository.js";
import { ApiError } from "../utils/ApiError.js";

const teams = TEAMS_COLLECTION;

export const createTeamService = async (teamName: string, budget: number): Promise<Team> => {
    try {
        const insertTeam = await createTeamRepo(teamName, budget);
        logger.info(`add team successfully, ID: ${insertTeam._id}`);
        return insertTeam;
    } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            logger.warn(`Duplicate team name: ${teamName}`);
            throw new ApiError(409, `Team: '${teamName}' already exists`);
        }
        throw error;
    }
};

export const getTeamByIdService = async (teamId: string): Promise<Team> => {
    const findTeam = await getTeamByIdRepo(teamId);
    if (findTeam) {
        logger.info(`find team: ${findTeam.teamName}`);
        return findTeam;
    } else {
        logger.warn(`team with ID ${teamId} not found`);
         throw new ApiError(404, `team with ID ${teamId} not found`);
    }
};

export const deleteTeamService = async (teamId: string): Promise<DeleteResult> => {
    const deletedTeam = await deleteTeamRepo(teamId);

    if (deletedTeam.deletedCount === 0) {
        logger.warn(`not found team id: ${teamId}`);
         throw new ApiError(404, `team not found`);
    } else {
        logger.info(`delete team successfully - id: ${teamId}`);
    }
    return deletedTeam;
};
