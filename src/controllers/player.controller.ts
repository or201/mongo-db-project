import type { Request, Response } from "express";
import type {
  AddPlayerToTeamInput,
  JerseyParamInput,
  PlayerIdParamInput,
  PlayerInput,
  SearchPlayerQueryInput,
  TeamIdParamInput,
} from "../schemas/player.schema.js";
import {
  addPlayerToTeamService,
  countPlayersService,
  createPlayerService,
  deletePlayerService,
  getAllPlayersInTeamService,
  getPlayerByPlayerIdService,
  getPlayersByTeamAndMinJerseyService,
  getTopThreeTeamsMostBrazilianPlayersService,
  searchPlayerByNameService,
} from "../services/player.service.js";

export const createPlayerHandler = async (req: Request, res: Response) => {
    try {
        const playerData = req.body as PlayerInput;
        const player = await createPlayerService(playerData);

        if (player === null) {
            return res.status(500).json("error server");
        } else if (player === "duplicate") {
            return res.status(409).json(`Player: '${playerData.playerId}' already exists`);
        }
        return res.status(201).json(player);
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
};

export const getPlayerByPlayerIdHandler = async (req: Request, res: Response) => {
    try {
        const { playerId } = req.params as unknown as PlayerIdParamInput;

        const player = await getPlayerByPlayerIdService(playerId);

        if (player === undefined) {
            return res.status(500).json("error server");
        } else if (player === null) {
            return res.status(404).json("player not found");
        } else {
            return res.status(200).json(player);
        }
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
};

export const deletePlayerHandler = async (req: Request, res: Response) => {
    try {
        const { playerId } = req.params as unknown as PlayerIdParamInput;

        const deletedPlayer = await deletePlayerService(playerId);

        if (!deletedPlayer) {
            return res.status(500).json("error server");
        }

        if (deletedPlayer.deletedCount === 0) {
            return res.status(404).json(`player not found`);
        }
        return res.status(200).json(`player deleted successfully`);
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
};

export const addPlayerToTeamHandler = async (req: Request, res: Response) => {
    try {
        const { playerId, teamId } = req.body as AddPlayerToTeamInput;
        const result = await addPlayerToTeamService(playerId, teamId);

        if (!result) {
            return res.status(500).json("error server");
        }

        if (result.matchedCount === 0) {
            return res.status(404).json(`player not found`);
        }

        return res.status(200).json(`player added to team successfully`);
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
};

export const countPlayersHandler = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params as TeamIdParamInput;
        const total = await countPlayersService(teamId);

        if (total === undefined) {
            return res.status(500).json("error server");
        }

        return res.status(200).json({ teamId, total });
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
};

export const getAllPlayersInTeamHandler = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params as TeamIdParamInput;
        const players = await getAllPlayersInTeamService(teamId);

        if (!players) {
            return res.status(500).json("error server");
        }

        if (players.length === 0) {
            return res.status(404).json("no players found for this team");
        }

        return res.status(200).json(players);
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
};

export const searchPlayerByNameHandler = async (req: Request, res: Response) => {
    try {
        const { name } = req.query as SearchPlayerQueryInput;
        const players = await searchPlayerByNameService(name);

        if (!players) {
            return res.status(500).json("error server");
        }

        if (players.length === 0) {
            return res.status(404).json("no players found");
        }

        return res.status(200).json(players);
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
};

export const getPlayersByTeamAndMinJerseyHandler = async (req: Request, res: Response) => {
    try {
        const { teamId, jerseyNum } = req.params as unknown as JerseyParamInput;
        const players = await getPlayersByTeamAndMinJerseyService(teamId, jerseyNum);

        if (!players) {
            return res.status(500).json("error server");
        }

        if (players.length === 0) {
            return res.status(404).json("no players found");
        }

        return res.status(200).json(players);
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
};

export const getTopThreeTeamsMostBrazilianPlayersHandler = async (_req: Request, res: Response) => {
    try {
        const teams = await getTopThreeTeamsMostBrazilianPlayersService();

        if (!teams) {
            return res.status(500).json("error server");
        }

        if (teams.length === 0) {
            return res.status(404).json("no teams found");
        }

        return res.status(200).json(teams);
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
};
