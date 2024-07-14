import { Router } from "express";
import { adminInstance } from "../controllers/index.js";
import { middlewareInstance } from "../middleware/index.js";
const adminRouter = Router();
adminRouter.get(
    "/get-list-user",
    middlewareInstance.AdminAuthen,
    adminInstance.GetListUsers
);
adminRouter.put(
    "/change-status-user/:userId",
    middlewareInstance.AdminAuthen,
    adminInstance.ChangeStatusUser
);
adminRouter.get(
    "/get-profile-user/:userId",
    middlewareInstance.AdminAuthen,
    adminInstance.GetProfileUser
);
adminRouter.get(
    "/get-list-course",
    middlewareInstance.AdminAuthen,
    adminInstance.GetListCourses
);

export { adminRouter };
