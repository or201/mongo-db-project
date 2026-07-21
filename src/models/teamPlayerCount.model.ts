import type { ObjectId } from "mongodb";

export interface TeamPlayerCount {
    _id?: ObjectId;
    totalPlayers: number;
}
