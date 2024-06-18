import { tutorServiceInstance } from "../services/index.js";

//------------------------------------------------
export class TutorController {
    static instance;

    //------------------------------------------------
    static getInstance() {
        if (!this.instance) {
            this.instance = new TutorController();
        }
        return this.instance;
    }
    async GetTutorLocation(req, res) {
        return await tutorServiceInstance.GetTutorLocation(req, res);
    }
    async CreateTeachingSubject(req, res) {
        return await tutorServiceInstance.CreateTeachingSubject(req, res);
    }
    async CreateLesson(req, res) {
        return await tutorServiceInstance.CreateLesson(req, res);
    }
}
//------------------------------------------------
export const tutorInstance = TutorController.getInstance();
