import { ObjectId, type DeleteResult } from "mongodb";
import { TEAMS_COLLECTION } from "../config/constants.js";
import { getDb } from "../config/db.js";
import { logger } from "../config/logger.js";
import type { Team } from "../models/team.model.js";

const teams = TEAMS_COLLECTION;

export const createTeam = async (teamName: string, budget: number): Promise<Team | undefined> => {
    try {
        const db = getDb();

        const team = {
            teamName,
            budget,
        };

        const insertTeam = await db.collection(teams).insertOne(team);
        logger.info(`add team successfully, ID: ${insertTeam.insertedId}`);
        return {
            _id: insertTeam.insertedId,
            ...team,
        };
    } catch (error) {
        if (error instanceof Error) {
            logger.fatal(`failed to createTeam ${teamName}: ${error.message}`);
        } else {
            logger.error(`Failed to createTeam: ${String(error)}`);
        }
        return undefined;
    }
};

export const getTeamById = async (teamId: string): Promise<Team | null | undefined> => {
    try {
        const db = getDb();
        const findTeam = await db.collection<Team>(teams).findOne({ _id: new ObjectId(teamId) });
        if (findTeam) {
            logger.info(`find team ${findTeam.teamName}`);
            return findTeam;
        } else {
            logger.warn(`team wuth ID ${teamId} not found`);
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

export const deleteTeam = async (teamId: number): Promise<DeleteResult | undefined> => {
    try {
        const db = getDb();

        const deletedTeam = await db.collection(teams).deleteOne({ teamId });
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
