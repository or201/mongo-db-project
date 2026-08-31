import { ObjectId, type DeleteResult, type UpdateResult } from "mongodb";
import { PLAYERS_COLLECTION } from "../config/constants.js";
import { getDb } from "../config/db.js";
import { logger } from "../config/logger.js";
import { type Player } from "../models/player.model.js";
import { type TeamPlayerCount } from "../models/teamPlayerCount.model.js";
import type { PlayerInput } from "../schemas/player.schema.js";

const players = PLAYERS_COLLECTION;

export const createPlayerRepo = async (playerData: PlayerInput): Promise<Player> => {
    const db = getDb();

    const player: Player = {
        ...playerData,
        team: new ObjectId(playerData.team),
    };

    const insertPlayer = await db.collection<Player>(players).insertOne(player);

    return {
        _id: insertPlayer.insertedId,
        ...player,
    };
};

export const getPlayerByPlayerIdRepo = async (playerId: number): Promise<Player | null> => {
    const db = getDb();
    const findPlayer = await db.collection<Player>(players).findOne({ playerId });

    return findPlayer;
};

export const addPlayerToTeam = async (playerId: number, teamId: string): Promise<UpdateResult | undefined> => {
    try {
        const db = getDb();

        const addTeam = await db.collection(players).updateOne({ playerId }, { $set: { team: new ObjectId(teamId) } });

        logger.info(`add player to team successfully`);
        return addTeam;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to addPlayerToTeam : ${error.message}`);
        } else {
            logger.error(`Failed to addPlayerToTeam: ${String(error)}`);
        }
        return undefined;
    }
};

export const countPlayers = async (teamId: string): Promise<number | undefined> => {
    try {
        const db = getDb();

        const total = await db.collection(players).countDocuments({ team: new ObjectId(teamId) });
        logger.info(`find total ${total} players`);
        return total;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to countPlayers : ${error.message}`);
        } else {
            logger.error(`Failed to countPlayers: ${String(error)}`);
        }
        return undefined;
    }
};

export const getAllPlayersInTeam = async (teamId: string): Promise<Player[] | undefined> => {
    try {
        const db = getDb();

        const findPlayers = await db
            .collection<Player>(players)
            .find({ team: new ObjectId(teamId) })
            .toArray();
        logger.info(`find ${findPlayers.length} players`);
        return findPlayers;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to getAllPlayersInTeam : ${error.message}`);
        } else {
            logger.error(`Failed to getAllPlayersInTeam: ${String(error)}`);
        }
        return undefined;
    }
};

export const searchPlayerByName = async (playerName: string): Promise<Player[] | undefined> => {
    try {
        const db = getDb();

        const findPlayer = await db
            .collection<Player>(players)
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
        } else {
            logger.error(`Failed to searchPlayerByName: ${String(error)}`);
        }
        return undefined;
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
        } else {
            logger.error(`Failed to getPlayersByTeamAndMinJersey: ${String(error)}`);
        }
        return undefined;
    }
};

export const getTopThreeTeamsMostBrazilianPlayers = async (): Promise<TeamPlayerCount[] | undefined> => {
    try {
        const db = getDb();

        const findPlayers = await db
            .collection(players)
            .aggregate<TeamPlayerCount>([
                {
                    $match: {
                        nationality: { $regex: /^brazil/i },
                    },
                },
                {
                    $group: { _id: "$team", totalPlayers: { $sum: 1 } },
                },
                {
                    $sort: { totalPlayers: -1 },
                },
                {
                    $limit: 3,
                },
            ])
            .toArray();
        return findPlayers;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to getTopThreeTeamsMostBrazilianPlayers: ${error.message}`);
        } else {
            logger.error(`Failed to getTopThreeTeamsMostBrazilianPlayers: ${String(error)}`);
        }
        return undefined;
    }
};

export const deletePlayer = async (playerId: number): Promise<DeleteResult | undefined> => {
    try {
        const db = getDb();

        const deletedPlayer = await db.collection(players).deleteOne({ playerId });
        return deletedPlayer;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to deletePlayer: ${error.message}`);
        } else {
            logger.error(`Failed to deletePlayer: ${String(error)}`);
        }
        return undefined;
    }
};
