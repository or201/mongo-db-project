import { ObjectId } from "mongodb";
import { TEAMS_COLLECTION } from "../config/constants.js";
import { closeDb, getDb, logger } from "../config/db.js";

const teams = TEAMS_COLLECTION;

export const createTeam = async (teamName: string, budget: number) => {
    try {
        const db = getDb();

        const team = {
            teamName,
            budget,
        };

        const insertTeam = await db.collection(teams).insertOne(team);
        logger.info(`add team successfully, ID: ${insertTeam.insertedId}`);
        return insertTeam;
    } catch (error) {
        if (error instanceof Error) {
            logger.fatal(`failed to insert team ${teamName}: ${error.message}`);
        }
    }
};

export const getTeamById = async (teamId: string) => {
    try {
        const db = getDb();
        const findTeam = await db.collection(teams).findOne({ _id: new ObjectId(teamId) });
        if (findTeam) {
            logger.info(`find team ${findTeam.teamName}`);
        } else {
            logger.warn(`team wuth ID ${teamId} not found`);
        }
        return findTeam;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`failed to find team id: ${teamId}`);
        }
    }
};

const result = await createTeam("aa", 1);
console.log(result);
await closeDb();
