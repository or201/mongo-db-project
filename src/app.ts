import express, { type Express, type Request, type Response } from "express";
import { PORT } from "./config/constants.js";
import { logger } from "./config/logger.js";
import teamRouter from "./routes/team.routes.js";
import { connectDb, initTeamIndex } from "./config/db.js";

const app: Express = express();
const port = PORT;

app.use(express.json());
app.use("/teams", teamRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

const run = async () => {
    try {
        await connectDb();
        await initTeamIndex();

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
            // logger.info(`Example app listening on port ${port}`);
        });
    } catch (error) {
        logger.fatal(`Failed to start server: ${error}`);
    }
};

run()