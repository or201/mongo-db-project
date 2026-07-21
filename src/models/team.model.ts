import type { ObjectId } from "mongodb";

export interface Team {
    _id?: ObjectId;
    teamName: string;
    budget: number;
}
