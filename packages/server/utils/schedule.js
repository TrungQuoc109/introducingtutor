import cron from "node-cron";
import { Otp } from "../model/index.js";
cron.schedule("*/15 * * * *", async () => {
    const fifteenMinutesAgo = new Date(new Date() - 15 * 60 * 1000);
    await Otp.destroy;
});
