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
import { ApiError } from "../utils/ApiError.js";
import { getTeamByIdService } from "./team.service.js";
import { getTeamByIdRepo } from "../repositories/team.repository.js";

export const createPlayerService = async (playerData: PlayerInput): Promise<Player> => {
    try {
        const insertPlayer = await createPlayerRepo(playerData);
        logger.info(`add player successfully, ID: ${insertPlayer.playerId}`);
        return insertPlayer;
    } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            logger.warn(`Duplicate player id: ${playerData.playerId}`);
            throw new ApiError(409, `Player: '${playerData.playerId}' already exists`);
        }

        throw error;
    }
};

export const getPlayerByPlayerIdService = async (playerId: number): Promise<Player> => {
    const findPlayer = await getPlayerByPlayerIdRepo(playerId);
    if (findPlayer) {
        logger.info(`find player: ${findPlayer.firstName} ${findPlayer.lastName}`);
        return findPlayer;
    } else {
        logger.warn(`player with ID ${playerId} not found`);
        throw new ApiError(404, "player not found");
    }
};

export const deletePlayerService = async (playerId: number): Promise<DeleteResult> => {
    const deletedPlayer = await deletePlayer(playerId);
    if (!deletedPlayer) {
        logger.error(`Failed to delete player id: ${playerId}`);
        throw new ApiError(404, `player not found`);
    }

    if (deletedPlayer.deletedCount === 0) {
        logger.warn(`not found player id: ${playerId}`);
        throw new ApiError(404, "player not found");
    }

    return deletedPlayer;
};

export const addPlayerToTeamService = async (playerId: number, teamId: string): Promise<UpdateResult> => {

    const player = await getPlayerByPlayerIdRepo(playerId);
    
    if (!player) {
        logger.warn(`Player with ID ${playerId} not found`);
        throw new ApiError(404, `Player with ID ${playerId} not found`);
    }

    const team = await getTeamByIdRepo(teamId);
    if (!team) {
        logger.warn(`Team with ID ${teamId} not found`);
        throw new ApiError(404, `Team with ID ${teamId} not found`);
    }

    if (player.team) {
        logger.warn(`Player ${playerId} is already assigned to a team`);
        throw new ApiError(400, `Player is already assigned to team: ${player.team}`);
    }

    const currentPlayers = await getAllPlayersInTeam(teamId) || [];

    if (currentPlayers.length >= 5) {
        logger.warn(`Team ${teamId} has reached its maximum capacity of 5 players`);
        throw new ApiError(400, `Team already has the maximum of 5 players`);
    }

    const currentTotalCost = currentPlayers.reduce((sum, p) => sum + (p.cost || 0), 0);
    const newTotalCost = currentTotalCost + (player.cost || 0);

    if (newTotalCost > team.budget) {
        logger.warn(`Adding player ${playerId} (cost: ${player.cost}) exceeds team budget (${team.budget})`);
        throw new ApiError(400, `Adding this player exceeds the team's budget limit`);
    }

    const addedTeam = await addPlayerToTeam(playerId, teamId);

    if (!addedTeam) {
        logger.error(
            `Failed to add player to team: addedTeam result does not exist (null/undefined) for playerId: ${playerId}`
        );
        throw new ApiError(500, `Failed to add player to team`);
    }

    logger.info(`Added player ${playerId} to team ${teamId} successfully`);
    return addedTeam;
};


export const countPlayersService = async (teamId: string): Promise<number> => {
    const total = await countPlayers(teamId);
    if (total === undefined || total === null) {
        logger.error(`Failed to count players for team: ${teamId}`);
        throw new ApiError(404, `Team with ID ${teamId} not found or failed to count`);
    }
    return total;
};

export const getAllPlayersInTeamService = async (teamId: string): Promise<Player[]> => {
    await getTeamByIdService(teamId);
    const findPlayers = await getAllPlayersInTeam(teamId);
    if (!findPlayers) {
        logger.error(`Failed to get players for team: ${teamId}`);
        throw new ApiError(404, "no players found for this team");
    }
    return findPlayers;
};

export const searchPlayerByNameService = async (playerName: string): Promise<Player[]> => {
    const findPlayers = await searchPlayerByName(playerName);
    if (!findPlayers) {
        logger.error(`Failed to search players by name: ${playerName}`);
        throw new ApiError(404, "no players found");
    }
    return findPlayers;
};

export const getPlayersByTeamAndMinJerseyService = async (teamId: string, jerseyNum: number): Promise<Player[]> => {
    const findPlayers = await getPlayersByTeamAndMinJersey(teamId, jerseyNum);
    if (!findPlayers) {
        logger.error(`Failed to get players for team ${teamId} with min jersey ${jerseyNum}`);
        throw new ApiError(404, "no players found");
    }
    return findPlayers;
};

export const getTopThreeTeamsMostBrazilianPlayersService = async (): Promise<TeamPlayerCount[]> => {
    const findTeams = await getTopThreeTeamsMostBrazilianPlayers();
    if (!findTeams) {
        logger.error(`Failed to get top three teams with brazilian players`);
        throw new ApiError(404, "no teams found");
    }
    return findTeams;
};
