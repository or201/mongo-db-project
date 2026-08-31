import type { DeleteResult } from "mongodb";
import { TEAMS_COLLECTION } from "../config/constants.js";
import { logger } from "../config/logger.js";
import type { Team } from "../models/team.model.js";
import { createTeamRepo, deleteTeamRepo, getTeamByIdRepo } from "../repositories/team.repository.js";

const teams = TEAMS_COLLECTION;

export const createTeamService = async (teamName: string, budget: number): Promise<Team | "duplicate" | null> => {
    try {
        const insertTeam = await createTeamRepo(teamName, budget);
        logger.info(`add team successfully, ID: ${insertTeam._id}`);
        return insertTeam;
    } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            logger.warn(`Duplicate team name: ${teamName}`);
            return "duplicate";
        }

        logger.error(`Failed to create team: ${String(error)}`);
        return null;
    }
};

export const getTeamByIdService = async (teamId: string): Promise<Team | null | undefined> => {
    try {
        const findTeam = await getTeamByIdRepo(teamId);
        if (findTeam) {
            logger.info(`find team: ${findTeam.teamName}`);
            return findTeam;
        } else {
            logger.warn(`team with ID ${teamId} not found`);
            return null;
        }
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`failed to getTeamById: ${teamId}`);
        } else {
            logger.error(`Failed to getTeamById: ${String(error)}`);
        }
        return undefined;
    }
};

export const deleteTeamService = async (teamId: string): Promise<DeleteResult | undefined> => {
    try {
        const deletedTeam = await deleteTeamRepo(teamId);
        if (deletedTeam.deletedCount === 0) {
            logger.warn(`not found team id: ${teamId}`);
        } else {
            logger.info(`delete team successfully - id: ${teamId}`);
        }
        return deletedTeam;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to deleteTeam: ${error.message}`);
        } else {
            logger.error(`Failed to deleteTeam: ${String(error)}`);
        }
        return undefined;
    }
};
