import { Router } from "express";
import { studentInstance } from "../controllers/index.js";
import { middlewareInstance } from "../middleware/index.js";
const studentRoute = Router();
studentRoute.post("/register-course", studentInstance.RegisterCourse);
studentRoute.post(
    "/confirm-register-course",
    studentInstance.ConfirmRegisterCourse
);
studentRoute.post("/cancelCourse", studentInstance.CancelCourse);
export { studentRoute };
