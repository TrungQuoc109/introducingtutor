import { Router } from "express";
import { studentInstance } from "../controllers/index.js";
import { middlewareInstance } from "../middleware/index.js";
const studentRoute = Router();
studentRoute.post("/payment", studentInstance.payment);
studentRoute.post("/register-course", studentInstance.registerCourse);
export { studentRoute };
