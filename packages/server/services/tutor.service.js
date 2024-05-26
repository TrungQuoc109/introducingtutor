import dotenv from "dotenv";
import { Subject, TeachingSubject, Tutor, User } from "../model/index.js";
import { responseMessageInstance } from "../utils/index.js";
import { CredentialsValidation } from "../constants/index.js";
import jwt from "jsonwebtoken";
dotenv.config();
export class TutorService {
    static instance;
    static getInstance() {
        if (!this.instance) {
            this.instance = new TutorService();
        }
        return this.instance;
    }
    async CreateTeachingSubject(req, res) {
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
            if (!data) {
                responseMessageInstance.throwError("Inlavid data.", 400);
            }
            data.startDate = new Date(data.startDate);

            //Validate lai
            const validationRules = [
                {
                    field: "studentCount",
                    type: "count",
                    errorMessage: "Invalid student count",
                },
                {
                    field: "numberOfSessions",
                    type: "count",
                    errorMessage: "Invalid Number of session",
                },
                {
                    field: "gradeLevel",
                    type: "gradelLevel",
                    errorMessage: "Invalid grade level",
                },
                {
                    field: "startDate",
                    type: "date",
                    errorMessage: "Invalid start date",
                },
                {
                    field: "price",
                    type: "price",
                    errorMessage: "Invalid price",
                },
            ];

            validationRules.forEach((rule) => {
                if (
                    !data[rule.field] ||
                    !CredentialsValidation(rule.type, data[rule.field])
                ) {
                    responseMessageInstance.throwError(rule.errorMessage, 400);
                }
            });
            const tutor = await Tutor.findOne({
                where: { userId: userId },
            });
            const subject = await Subject.findOne({
                where: { id: data.subjectId },
            });
            if (!tutor) {
                responseMessageInstance.throwError("Tutor not found!", 404);
            }
            if (!subject) {
                responseMessageInstance.throwError("Subject not found!", 404);
            }
            data.instructorId = tutor.id;

            await TeachingSubject.create(data);

            return responseMessageInstance.getSuccess(
                res,
                200,
                "Create teaching successful"
            );
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

export const tutorServiceInstance = TutorService.getInstance();
