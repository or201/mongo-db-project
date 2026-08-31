import "dotenv/config";
import { Db, MongoClient } from "mongodb";
import { DB_NAME, MONGO_URI, TEAMS_COLLECTION, PLAYERS_COLLECTION } from "./constants.js";
import { logger } from "./logger.js";

const uri = MONGO_URI;

if (!uri) {
    logger.fatal("uri is undefined");
    throw new Error("uri is undefined");
}

const client = new MongoClient(uri);

export const connectDb = async (): Promise<void> => {
    try {
        await client.connect();
        logger.info("Database connection successfully");
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to connect to DB: ${error.message}`);
        }
    }
};

export const getDb = (): Db => {
    return client.db(DB_NAME);
};

export const closeDb = async (): Promise<void> => {
    try {
        await client.close();
        logger.info("Database connection closed successfully");
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Failed to close DB connection: ${error.message}`);
        }
    }
};

export const initTeamIndex = async () => {
    const db = client.db(DB_NAME);
    await db.collection(TEAMS_COLLECTION).createIndex({ teamName: 1 }, { unique: true });
};

export const initPlayerIndex = async () => {
    const db = client.db(DB_NAME);
    await db.collection(PLAYERS_COLLECTION).createIndex({ playerId: 1 }, { unique: true });
};
