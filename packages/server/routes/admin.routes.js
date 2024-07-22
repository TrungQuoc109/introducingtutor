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
adminRouter.get(
    "/get-infor-course/:courseId",
    middlewareInstance.AdminAuthen,
    adminInstance.GetInforCourse
);
adminRouter.get(
    "/get-tutor-earnings",
    middlewareInstance.AdminAuthen,
    adminInstance.GetEarnings
);

export { adminRouter };
