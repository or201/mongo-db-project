import "dotenv/config";

export const MONGO_URI = process.env.MONGO_URI || "";
export const PORT = process.env.PROT || 3000;
export const DB_NAME = process.env.DB_NAME || "footballTeamManager";
export const PLAYERS_COLLECTION = process.env.PLAYERS_COLLECTION || "players";
export const TEAMS_COLLECTION = process.env.TEAMS_COLLECTION || "teams";
