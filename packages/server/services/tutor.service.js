import dotenv from "dotenv";

dotenv.config();
export class TutorService {
    static instance;
    static getInstance() {
        if (!this.instance) {
            this.instance = new TutorService();
        }
        return this.instance;
    }
}

export const tutorServiceInstance = TutorService.getInstance();
