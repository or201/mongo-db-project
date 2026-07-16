import "dotenv/config";
import { MongoClient } from "mongodb";
import pino from "pino";
import { MONGO_URI, DB_NAME } from "./constants.js";

export const logger = pino({
    level: "info",
});

const uri = MONGO_URI;

if (!uri) {
    logger.fatal("uri is undefined");
    throw new Error("uri is undefined");
}

const client = new MongoClient(uri);

const connectDb = async () => {
    try {
        await client.connect();
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`failed to connect to DB: ${error.message}`);
        }
    }
};

export const getDb = () => {
    return client.db(DB_NAME);
};

export const closeDb = async () => {
    try {
        await client.close();
        logger.info("Database connection closed successfully");
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Failed to close DB connection: ${error.message}`);
        }
    }
};