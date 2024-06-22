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
    async payment(req, res) {
        return await studentServiceInstance.payment(req, res);
    }
    async registerCourse(req, res) {
        return await studentServiceInstance.registerCourse(req, res);
    }
}
//------------------------------------------------
export const studentInstance = StudentController.getInstance();
