import { studentServiceInstance } from "../services/index.js";

//------------------------------------------------
export class StudentController {
    static instance;

    //------------------------------------------------
    static getInstance() {
        if (!this.instance) {
            this.instance = new StudentController();
        }
        return this.instance;
    }

    async RegisterCourse(req, res) {
        return await studentServiceInstance.RegisterCourse(req, res);
    }
    async ConfirmRegisterCourse(req, res) {
        return await studentServiceInstance.ConfirmRegisterCourse(req, res);
    }
}
//------------------------------------------------
export const studentInstance = StudentController.getInstance();
