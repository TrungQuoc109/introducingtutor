import { userServiceInstance } from "../services/index.js";
import { responseMessageInstance } from "../utils/index.js";

//------------------------------------------------
export class UserController {
    static instance;

    //------------------------------------------------
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserController();
        }
        return this.instance;
    }

    //-----------------------------------------------
    async Hello(_, res) {
        return await responseMessageInstance.getSuccess(
            res,
            200,
            "Hello World From User Router!",
            {}
        );
    }
    async SendOTP(req, res) {
        return await userServiceInstance.SendOTP(req, res);
    }
    async Login(req, res) {
        return await userServiceInstance.Login(req, res);
    }
    async ChangePassword(req, res) {
        return await userServiceInstance.ChangePassword(req, res);
    }
    async SignUp(req, res) {
        return await userServiceInstance.SignUp(req, res);
    }
    async ForgotPassword(req, res) {
        return await userServiceInstance.ForgotPassword(req, res);
    }
    async GetProfile(req, res) {
        return await userServiceInstance.GetProfile(req, res);
    }

    async GetSubject(req, res) {
        return await userServiceInstance.GetSubject(req, res);
    }
    async GetTeachingSubjects(req, res) {
        return await userServiceInstance.GetTeachingSubjects(req, res);
    }
    async GetTutors(req, res) {
        return await userServiceInstance.GetTutors(req, res);
    }
    async GetLession(req, res) {
        return await userServiceInstance.GetLession(req, res);
    }
    async ChangeProfile(req, res) {
        return await userServiceInstance.ChangeProfile(req, res);
    }
}

//------------------------------------------------
export const userInstance = UserController.getInstance();
