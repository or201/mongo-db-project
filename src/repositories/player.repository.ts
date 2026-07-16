import { ObjectId } from "mongodb";
import { PLAYERS_COLLECTION } from "../config/constants.js";
import { closeDb, getDb, logger } from "../config/db.js";

const players = PLAYERS_COLLECTION;

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
            logger.error(`failed to insert player ${firstName} : ${error.message}`);
        }
    }
};

export const addPlayerToTeam = async (playerId: number, teamId: string) => {
    try {
        const db = getDb();

        const addTeam = await db.collection(players).updateOne({ playerId }, { $set: { team: teamId } });
        logger.info(`add player to team successfully`);
        return;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`failed to add player to team : ${error.message}`);
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
            logger.error(`failed to count players : ${error.message}`);
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
            logger.error(`not found players : ${error.message}`);
        }
    }
};

export const searchPlayerByName = async (playerName: string) => {
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

        logger.info(`find players`);
        return findPlayer;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`not found player: ${error.message}`);
        }
    }
};

const result = await addPlayerToTeam(1, "6a58aa581db51158c71aedc6");
console.log(result);
await closeDb();
