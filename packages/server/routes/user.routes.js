import { Router } from "express";
import { userInstance } from "../controllers/index.js";
import { middlewareInstance } from "../middleware/index.js";

// -----------------------------------------------
const userRouter = Router();
userRouter.get("/hello-world", userInstance.Hello);
userRouter.post("/login", userInstance.Login);
userRouter.post(
    "/change-password",
    middlewareInstance.Authen,
    userInstance.ChangePassword
);
userRouter.post("/sign-up", userInstance.SignUp);
userRouter.get(
    "/get-profile",
    middlewareInstance.Authen,
    userInstance.GetProfile
);
userRouter.post("/send-otp", userInstance.SendOTP);
userRouter.post("/forgot-password", userInstance.ForgotPassword);
userRouter.get("/get-subject", userInstance.GetSubject);
userRouter.get("/get-courses/:page", userInstance.GetTeachingSubjects);
userRouter.get("/get-tutors/:page", userInstance.GetTutors);
userRouter.get("/get-lessions/:courseId/:page?", userInstance.GetLession);
userRouter.post(
    "/change-profile",
    middlewareInstance.Authen,
    userInstance.ChangeProfile
);

// -----------------------------------------------
export { userRouter };
