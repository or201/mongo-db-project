import express, { type Express, type Request, type Response } from "express";
import { PORT } from "./config/constants.js";
import { connectDb, initPlayerIndex, initTeamIndex } from "./config/db.js";
import { logger } from "./config/logger.js";
import { playerRouter } from "./routes/player.routes.js";
import teamRouter from "./routes/team.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app: Express = express();
const port = PORT;

app.use(express.json());
app.use("/teams", teamRouter);
app.use("/players", playerRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use(errorHandler)

const run = async () => {
    try {
        await connectDb();
        await initTeamIndex();
        await initPlayerIndex();

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
            // logger.info(`Example app listening on port ${port}`);
        });
    } catch (error) {
        logger.fatal(`Failed to start server: ${error}`);
    }
};

run();
