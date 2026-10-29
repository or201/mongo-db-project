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
import { ApiError } from "../utils/ApiError.js";

export const createPlayerHandler = async (req: Request<{}, {}, PlayerInput>, res: Response) => {
    const playerData = req.body;
    const player = await createPlayerService(playerData);

    return res.status(201).json(player);
};

export const getPlayerByPlayerIdHandler = async (req: Request<{ playerId: string }>, res: Response) => {
    const { playerId } = req.params;

    const player = await getPlayerByPlayerIdService(Number(playerId));
    return res.status(200).json(player);
};

export const deletePlayerHandler = async (req: Request<{ playerId: string }>, res: Response) => {
    const playerId = Number(req.params.playerId);

    await deletePlayerService(playerId);

    return res.status(204).send();
};

export const addPlayerToTeamHandler = async (req: Request<{}, {}, AddPlayerToTeamInput>, res: Response) => {
    const { playerId, teamId } = req.body;
    const result = await addPlayerToTeamService(playerId, teamId);

    if (result.matchedCount === 0) {
        throw new ApiError(404, `player not found`);
    }

    return res.status(200).json(`player added to team successfully`);
};

export const countPlayersHandler = async (req: Request<{ teamId: string }>, res: Response) => {
    const { teamId } = req.params;
    const total = await countPlayersService(teamId);

    return res.status(200).json({ teamId, total });
};

export const getAllPlayersInTeamHandler = async (req: Request<TeamIdParamInput>, res: Response) => {
    const { teamId } = req.params;
    const players = await getAllPlayersInTeamService(teamId);

    return res.status(200).json(players);
};

export const searchPlayerByNameHandler = async (req: Request<{}, {}, {}, SearchPlayerQueryInput>, res: Response) => {
    const { name } = req.query;
    const players = await searchPlayerByNameService(name);

    return res.status(200).json(players);
};

export const getPlayersByTeamAndMinJerseyHandler = async (req: Request<JerseyParamInput>, res: Response) => {
    const { teamId, jerseyNum } = req.params;
    const players = await getPlayersByTeamAndMinJerseyService(teamId, Number(jerseyNum));

    return res.status(200).json(players);
};

export const getTopThreeTeamsMostBrazilianPlayersHandler = async (_req: Request, res: Response) => {
    const teams = await getTopThreeTeamsMostBrazilianPlayersService();

    return res.status(200).json(teams);
};
