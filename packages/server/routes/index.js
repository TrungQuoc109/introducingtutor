import { adminRouter } from "./admin.routes.js";
import { userRouter } from "./user.routes.js";
import {} from "../model/tutor.model.js";
import { tutorRouter } from "./tutor.routes.js";
import { studentRoute } from "./student.routes.js";
export const routes = (app) => {
    app.use("/v1/api/user", userRouter);
    app.use("/v1/api/admin", adminRouter);
    app.use("/v1/api/tutor", tutorRouter);
    app.use("/v1/api/student", studentRoute);
};
