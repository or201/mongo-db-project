import { ObjectId, type DeleteResult } from "mongodb";
import { TEAMS_COLLECTION } from "../config/constants.js";
import { getDb } from "../config/db.js";
import type { Team } from "../models/team.model.js";

const teams = TEAMS_COLLECTION;

export const createTeamRepo = async (teamName: string, budget: number): Promise<Team> => {
    const db = getDb();
    const team = { teamName, budget };

    const insertTeam = await db.collection(teams).insertOne(team);

    return {
        _id: insertTeam.insertedId,
        ...team,
    };
};

export const getTeamByIdRepo = async (teamId: string): Promise<Team | null> => {
    const db = getDb();
    const findTeam = await db.collection<Team>(teams).findOne({ _id: new ObjectId(teamId) });

    return findTeam;
};

export const deleteTeamRepo = async (teamId: string): Promise<DeleteResult> => {
    const db = getDb();
    const deletedTeam = await db.collection(teams).deleteOne({ _id: new ObjectId(teamId) });

    return deletedTeam;
};
