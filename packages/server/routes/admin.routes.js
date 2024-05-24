import { Router } from "express";
import { adminInstance } from "../controllers/index.js";
import { middlewareInstance } from "../middleware/index.js";
const adminRouter = Router();
adminRouter.get(
    "/get-list-user",
    middlewareInstance.Authen,
    adminInstance.GetListUsers
);
adminRouter.put(
    "/change-status-user/:userId",
    middlewareInstance.Authen,
    adminInstance.ChangeStatusUser
);
export { adminRouter };
