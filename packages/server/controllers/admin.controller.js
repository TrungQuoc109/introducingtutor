import { adminServiceInstance } from "../services/index.js";

//------------------------------------------------
export class AdminController {
    static instance;

    //------------------------------------------------
    static getInstance() {
        if (!this.instance) {
            this.instance = new AdminController();
        }
        return this.instance;
    }
    async GetListUsers(req, res) {
        return await adminServiceInstance.GetListUsers(req, res);
    }
    async ChangeStatusUser(req, res) {
        return await adminServiceInstance.ChangeStatusUser(req, res);
    }
    async GetProfileUser(req, res) {
        return await adminServiceInstance.GetProfileUser(req, res);
    }
    async GetListCourses(req, res) {
        return await adminServiceInstance.GetListCourses(req, res);
    }
}
//------------------------------------------------
export const adminInstance = AdminController.getInstance();
