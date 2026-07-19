import { ObjectId } from "mongodb";
import { PLAYERS_COLLECTION, TEAMS_COLLECTION } from "../config/constants.js";
import { closeDb, getDb } from "../config/db.js";
import { logger } from "../config/logger.js";
import { Player } from "../models/player.model.js";

const players = PLAYERS_COLLECTION;
const teams = TEAMS_COLLECTION;

export const createPlayer = async (
    playerId: number,
    firstName: string,
    lastName: string,
    nationality: string,
    jerseyNumber: number,
    cost: number,
    team: ObjectId
) => {
    try {
        const db = getDb();

        const player = {
            playerId,
            firstName,
            lastName,
            nationality,
            jerseyNumber,
            cost,
            team,
        };

        const insertPlayer = await db.collection(players).insertOne(player);
        logger.info(`add player successfully, ID: ${insertPlayer.insertedId}`);
        return insertPlayer;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to createPlayer ${firstName} : ${error.message}`);
        } else {
            logger.error(`Failed to getPlayersByTeamAndMinJersey: ${String(error)}`);
        }
        return undefined;
    }
};

export const addPlayerToTeam = async (playerId: number, teamId: string) => {
    try {
        const db = getDb();

        const addTeam = await db.collection(players).updateOne({ playerId }, { $set: { team: new ObjectId(teamId) } });

        logger.info(`add player to team successfully`);
        return addTeam;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to addPlayerToTeam : ${error.message}`);
        }
    }
};

export const countPlayers = async (teamId: string) => {
    try {
        const db = getDb();

        const total = await db.collection(players).countDocuments({ team: new ObjectId(teamId) });
        logger.info(`find total ${total} players`);
        return total;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to countPlayers : ${error.message}`);
        }
    }
};

export const getAllPlayersInTeam = async (teamId: string) => {
    try {
        const db = getDb();

        const findPlayers = await db
            .collection(players)
            .find({ team: new ObjectId(teamId) })
            .toArray();
        logger.info(`find ${findPlayers.length} players`);
        return findPlayers;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to getAllPlayersInTeam : ${error.message}`);
        }
    }
};

export const searchPlayerByName = async (playerName: string): Promise<Player[] | undefined> => {
    try {
        const db = getDb();

        const findPlayer = await db
            .collection(players)
            .find({
                $or: [
                    { firstName: { $regex: playerName, $options: "i" } },
                    { lastName: { $regex: playerName, $options: "i" } },
                ],
            })
            .toArray();

        if (findPlayer.length === 0) {
            logger.info(`not found players`);
        } else {
            logger.info(`found ${findPlayer.length} players`);
        }
        return findPlayer;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to searchPlayerByName: ${error.message}`);
        }
    }
};

export const getPlayersByTeamAndMinJersey = async (
    teamId: string,
    jerseyNum: number
): Promise<Player[] | undefined> => {
    try {
        const db = getDb();

        const findPlayers = await db
            .collection<Player>(players)
            .find({ team: new ObjectId(teamId), jerseyNumber: { $gte: jerseyNum } })
            .toArray();
        if (findPlayers.length === 0) {
            logger.info(`not found players`);
        } else {
            logger.info(`found ${findPlayers.length} players`);
        }
        return findPlayers;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to getPlayersByTeamAndMinJersey: ${error.message}`);
        }
    }
};

const result = await searchPlayerByName("שש");
console.log(result);
await closeDb();
