import { Router } from "express";
import { studentInstance } from "../controllers/index.js";
import { middlewareInstance } from "../middleware/index.js";
const studentRoute = Router();
studentRoute.post(
    "/register-course",
    middlewareInstance.Authen,
    studentInstance.RegisterCourse
);
studentRoute.post(
    "/confirm-register-course",
    middlewareInstance.Authen,
    studentInstance.ConfirmRegisterCourse
);
studentRoute.post(
    "/cancel-course",
    middlewareInstance.Authen,
    studentInstance.CancelCourse
);
export { studentRoute };
