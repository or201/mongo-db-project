import { type DeleteResult, type UpdateResult } from "mongodb";
import { logger } from "../config/logger.js";
import type { Player } from "../models/player.model.js";
import type { TeamPlayerCount } from "../models/teamPlayerCount.model.js";
import {
    addPlayerToTeam,
    countPlayers,
    createPlayerRepo,
    deletePlayer,
    getAllPlayersInTeam,
    getPlayerByPlayerIdRepo,
    getPlayersByTeamAndMinJersey,
    getTopThreeTeamsMostBrazilianPlayers,
    searchPlayerByName,
} from "../repositories/player.repository.js";
import type { PlayerInput } from "../schemas/player.schema.js";

export const createPlayerService = async (playerData: PlayerInput): Promise<Player | "duplicate" | null> => {
    try {
        const insertPlayer = await createPlayerRepo(playerData);
        logger.info(`add player successfully, ID: ${insertPlayer.playerId}`);
        return insertPlayer;
    } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            logger.warn(`Duplicate player id: ${playerData.playerId}`);
            return "duplicate";
        }

        if (error instanceof Error) {
            logger.error(`Faild to createPlayer ${playerData.firstName} : ${error.message}`);
        } else {
            logger.error(`Failed to createPlayer: ${String(error)}`);
        }
        return null;
    }
};

export const getPlayerByPlayerIdService = async (playerId: number): Promise<Player | null | undefined> => {
    try {
        const findPlayer = await getPlayerByPlayerIdRepo(playerId);
        if (findPlayer) {
            logger.info(`find player: ${findPlayer.firstName} ${findPlayer.lastName}`);
            return findPlayer;
        } else {
            logger.warn(`player with ID ${playerId} not found`);
            return null;
        }
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`failed to getPlayerByPlayerId: ${playerId}`);
        } else {
            logger.error(`Failed to getPlayerByPlayerId: ${String(error)}`);
        }
        return undefined;
    }
};

export const deletePlayerService = async (playerId: number): Promise<DeleteResult | undefined> => {
    try {
        const deletedPlayer = await deletePlayer(playerId);
        if (!deletedPlayer) {
            logger.error(`Failed to delete player id: ${playerId}`);
            return undefined;
        }

        if (deletedPlayer.deletedCount === 0) {
            logger.warn(`not found player id: ${playerId}`);
        } else {
            logger.info(`delete player successfully - id: ${playerId}`);
        }
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

export const addPlayerToTeamService = async (playerId: number, teamId: string): Promise<UpdateResult | undefined> => {
    try {
        const addedTeam = await addPlayerToTeam(playerId, teamId);

        if (!addedTeam) {
            logger.error(`Failed to add player to team`);
            throw new Error(`Failed to add player to team`);
        }

        if (addedTeam.matchedCount === 0) {
            logger.warn(`player with ID ${playerId} not found`);
        } else {
            logger.info(`add player to team successfully`);
        }
        return addedTeam;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to addPlayerToTeam : ${error.message}`);
        } else {
            logger.error(`Failed to addPlayerToTeam: ${String(error)}`);
        }
        return undefined;
    }
};

export const countPlayersService = async (teamId: string): Promise<number | undefined> => {
    try {
        const total = await countPlayers(teamId);
        if (total === undefined) {
            logger.error(`Failed to count players for team: ${teamId}`);
            return undefined;
        }
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

export const getAllPlayersInTeamService = async (teamId: string): Promise<Player[] | undefined> => {
    try {
        const findPlayers = await getAllPlayersInTeam(teamId);
        if (!findPlayers) {
            logger.error(`Failed to get players for team: ${teamId}`);
            return undefined;
        }
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

export const searchPlayerByNameService = async (playerName: string): Promise<Player[] | undefined> => {
    try {
        const findPlayers = await searchPlayerByName(playerName);
        if (!findPlayers) {
            logger.error(`Failed to search players by name: ${playerName}`);
            return undefined;
        }
        return findPlayers;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to searchPlayerByName: ${error.message}`);
        } else {
            logger.error(`Failed to searchPlayerByName: ${String(error)}`);
        }
        return undefined;
    }
};

export const getPlayersByTeamAndMinJerseyService = async (
    teamId: string,
    jerseyNum: number
): Promise<Player[] | undefined> => {
    try {
        const findPlayers = await getPlayersByTeamAndMinJersey(teamId, jerseyNum);
        if (!findPlayers) {
            logger.error(`Failed to get players for team ${teamId} with min jersey ${jerseyNum}`);
            return undefined;
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

export const getTopThreeTeamsMostBrazilianPlayersService = async (): Promise<TeamPlayerCount[] | undefined> => {
    try {
        const findTeams = await getTopThreeTeamsMostBrazilianPlayers();
        if (!findTeams) {
            logger.error(`Failed to get top three teams with brazilian players`);
            return undefined;
        }
        return findTeams;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to getTopThreeTeamsMostBrazilianPlayers: ${error.message}`);
        } else {
            logger.error(`Failed to getTopThreeTeamsMostBrazilianPlayers: ${String(error)}`);
        }
        return undefined;
    }
};
