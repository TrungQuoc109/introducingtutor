import { Router } from "express";
import { userInstance } from "../controllers/index.js";

// -----------------------------------------------
const userRouter = Router();
userRouter.get("/hello-world", userInstance.Hello);
userRouter.post("/login", userInstance.Login);
userRouter.post("/change-password", userInstance.ChangePassword);
userRouter.post("/sign-up", userInstance.SignUp);
userRouter.get("/get-profile", userInstance.GetProfile);
userRouter.post("/send-otp", userInstance.SendOTP);
userRouter.post("/forgot-password", userInstance.ForgotPassword);
userRouter.get("/dumpdata", userInstance.DumpData);
// -----------------------------------------------
export { userRouter };
