import "dotenv/config";
import { MongoClient } from "mongodb";
import pino from "pino";

const logger = pino({
    level: "info",
});

const uri = process.env.MONGODB_URI;

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
            logger.fatal("failed to connect to DB: ${error.message}");
        }
    }
};

export const getDb = () => {
    return client.db();
};
