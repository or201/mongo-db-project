import { Router } from "express";
import {
  addPlayerToTeamHandler,
  countPlayersHandler,
  createPlayerHandler,
  deletePlayerHandler,
  getAllPlayersInTeamHandler,
  getPlayerByPlayerIdHandler,
  getPlayersByTeamAndMinJerseyHandler,
  getTopThreeTeamsMostBrazilianPlayersHandler,
  searchPlayerByNameHandler,
} from "../controllers/player.controller.js";
import {
  validateRequest
} from "../middlewares/RequestValidate.middleware.js";
import {
  addPlayerToTeamSchema,
  jerseyParamSchema,
  playerIdParamSchema,
  playerSchema,
  searchPlayerQuerySchema,
  teamIdParamSchema,
} from "../schemas/player.schema.js";

export const playerRouter = Router();

// GET /players/search?name= - Search players by name
playerRouter.get("/search", validateRequest(searchPlayerQuerySchema), searchPlayerByNameHandler);

// GET /players/stats/brazil-top-teams - Top 3 teams with most Brazilian players
playerRouter.get("/stats/brazil-top-teams", getTopThreeTeamsMostBrazilianPlayersHandler);

// PATCH /players/team - Add player to team
playerRouter.patch("/team", validateRequest(addPlayerToTeamSchema), addPlayerToTeamHandler);

// GET /players/team/:teamId/count - Count players in team
playerRouter.get("/team/:teamId/count", validateRequest(teamIdParamSchema), countPlayersHandler);

// GET /players/team/:teamId/jersey/:jerseyNum - Get players by team and min jersey number
playerRouter.get(
    "/team/:teamId/jersey/:jerseyNum",
    validateRequest(jerseyParamSchema),
    getPlayersByTeamAndMinJerseyHandler
);

// GET /players/team/:teamId - Get all players in team
playerRouter.get("/team/:teamId", validateRequest(teamIdParamSchema), getAllPlayersInTeamHandler);

// POST /players - Create player
playerRouter.post("/", validateRequest(playerSchema), createPlayerHandler);

// GET /players/:playerId - Get player by ID
playerRouter.get("/:playerId", validateRequest(playerIdParamSchema), getPlayerByPlayerIdHandler);

// DELETE /players/:playerId - Delete player by ID
playerRouter.delete("/:playerId", validateRequest(playerIdParamSchema), deletePlayerHandler);
