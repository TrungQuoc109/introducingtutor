import { Router } from "express";
import { tutorInstance } from "../controllers/index.js";
import { middlewareInstance } from "../middleware/index.js";
const tutorRouter = Router();
tutorRouter.post(
    "/teaching-subject",
    middlewareInstance.Authen,
    tutorInstance.CreateTeachingSubject
);
tutorRouter.post(
    "/create-lesson",
    middlewareInstance.Authen,
    tutorInstance.CreateLesson
);
tutorRouter.get(
    "/get-tutor-location",
    middlewareInstance.Authen,
    tutorInstance.GetTutorLocation
);
tutorRouter.post(
    "/change-status-course",
    middlewareInstance.Authen,
    tutorInstance.ChangStatusCourse
);
tutorRouter.post(
    "/update-course",
    middlewareInstance.Authen,
    tutorInstance.UpdateCourse
);
tutorRouter.post(
    "/delete-lesson",
    middlewareInstance.Authen,
    tutorInstance.DeleteLesson
);
export { tutorRouter };
