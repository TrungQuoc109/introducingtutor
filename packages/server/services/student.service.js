import dotenv from "dotenv";
import { ROLE } from "../constants";
dotenv.config();
export class StudentService {
    static instance;
    static getInstance() {
        if (!this.instance) {
            this.instance = new StudentService();
        }
        return this.instance;
    }
    async RegisterCourse(req, res) {
        try {
            const accessKey = req.headers["authorization"] ?? "";
            const data = req.body.data ?? {};
            if (!accessKey) {
                return responseMessageInstance.throwError(
                    "Invalid accessKey",
                    400
                );
            }

            const decodedToken = jwt.verify(
                accessKey.split(" ")[1],
                process.env.SECRET_KEY
            );
            const userId = decodedToken.userId;
            const role = decodedToken.role;
            if (!role || role != ROLE.student) {
                responseMessageInstance.throwError("Unauthorized", 401);
            }
            if (
                !data ||
                (typeof data === "object" && Object.keys(data).length === 0)
            ) {
                responseMessageInstance.throwError("Inlavid data.", 400);
            }
        } catch (error) {
            console.log(error);
            return responseMessageInstance.getError(
                res,
                error.code ?? 500,
                error.message
            );
        }
    }
}

export const studentServiceInstance = StudentService.getInstance();
