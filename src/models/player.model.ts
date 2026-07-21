import type { ObjectId } from "mongodb";

export interface Player {
    _id?: ObjectId;
    playerId: number;
    firstName: string;
    lastName: string;
    nationality: string;
    jerseyNumber: number;
    cost: number;
    team: ObjectId;
}
