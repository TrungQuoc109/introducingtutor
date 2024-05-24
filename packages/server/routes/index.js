import { adminRouter } from "./admin.routes.js";
import { userRouter } from "./user.routes.js";
export const routes = (app) => {
    app.use("/v1/api/user", userRouter);
    app.use("/v1/api/admin", adminRouter);
};
