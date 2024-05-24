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

    async DumpData(req, res) {
        return await userServiceInstance.DumpData(req, res);
    }
}

//------------------------------------------------
export const userInstance = UserController.getInstance();
