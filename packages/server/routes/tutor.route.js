import { Router } from "express";
import { tutorInstance } from "../controllers/index.js";
import { middlewareInstance } from "../middleware/index.js";
const tutorRouter = Router();
tutorRouter.post("/teaching-subject", tutorInstance.CreateTeachingSubject);
tutorRouter.post("/create-lession", tutorInstance.CreateLession);
export { tutorRouter };
