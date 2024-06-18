import dotenv from "dotenv";
import {
    Lesson,
    Location,
    Subject,
    TeachingSubject,
    Tutor,
} from "../model/index.js";
import { responseMessageInstance } from "../utils/index.js";
import { CredentialsValidation, ROLE } from "../constants/index.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
dotenv.config();
export class TutorService {
    static instance;
    static getInstance() {
        if (!this.instance) {
            this.instance = new TutorService();
        }
        return this.instance;
    }
    async GetTutorLocation(req, res) {
        try {
            const accessKey = req.headers["authorization"] ?? "";

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
            if (!role || role != ROLE.tutor) {
                responseMessageInstance.throwError("Unauthorized", 401);
            }
            const location = await Location.findAll({
                attributes: ["districtsId", "name"],
                include: [
                    { model: Tutor, attributes: [], where: { userId: userId } },
                ],
                order: [["districtsId", "ASC"]],
            });
            if (location.length == 0) {
                responseMessageInstance.throwError("Location not found!", 404);
            }
            return responseMessageInstance.getSuccess(res, 200, "successful", {
                data: location,
            });
        } catch (error) {
            console.log(error);
            return responseMessageInstance.getError(
                res,
                error.code ?? 500,
                error.message
            );
        }
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
            const role = decodedToken.role;
            if (!role || role != ROLE.tutor) {
                responseMessageInstance.throwError("Unauthorized", 401);
            }
            if (
                !data ||
                (typeof data === "object" && Object.keys(data).length === 0)
            ) {
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
            if (data.name.length == 0) {
                responseMessageInstance.throwError("invalid course name", 400);
            }
            if (data.description.length == 0) {
                responseMessageInstance.throwError(
                    "invalid course description",
                    400
                );
            }
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
            const location = await Location.findOne({
                where: { districtsId: data.location, tutorId: tutor.id },
            });
            if (!subject) {
                responseMessageInstance.throwError("Subject not found!", 404);
            }
            if (!location) {
                responseMessageInstance.throwError("");
            }

            data.instructorId = tutor.id;

            const course = await TeachingSubject.create(data);

            return responseMessageInstance.getSuccess(
                res,
                200,
                "Create teaching subject successful",
                { courseId: course.id }
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
    async CreateLesson(req, res) {
        try {
            const accessKey = req.headers["authorization"] ?? "";
            const data = req.body.data ?? {};
            const lessonTimes = [90, 120, 150, 180];
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
            if (!role || role != ROLE.tutor) {
                responseMessageInstance.throwError("Unauthorized", 401);
            }
            if (
                !data ||
                (typeof data === "object" && Object.keys(data).length === 0)
            ) {
                responseMessageInstance.throwError("Inlavid data.", 400);
            }
            if (!data.title || data.title.length == 0) {
                responseMessageInstance.throwError("Invalid title", 400);
            }
            const date = new Date(data.date);
            const [hour, minutes, second] = data.startTime
                .split(":")
                .map(Number);
            const startLimit = new Date(date);
            startLimit.setHours(7, 0, 0, 0);

            const endLimit = new Date(date);
            endLimit.setHours(19, 0, 0, 0);

            date.setHours(hour, minutes, second, 0);
            if (
                !CredentialsValidation("date", date) ||
                date < startLimit ||
                date > endLimit
            ) {
                responseMessageInstance.throwError("Invalid Start Date", 400);
            }

            if (!lessonTimes.some((item) => item == data.duration)) {
                responseMessageInstance.throwError("Invalid Duration", 400);
            }
            const teachingDate = new Date(
                date.getTime() + data.duration * 60 * 1000
            );
            const teachingTime = `${teachingDate.getHours()}:${teachingDate.getMinutes()}:${teachingDate.getSeconds()}`;
            const tutor = await Tutor.findOne({
                attributes: ["id"],
                where: { userId: userId },
            });
            if (!tutor) {
                responseMessageInstance.throwError("Tutor not found!", 404);
            }
            const course = await TeachingSubject.findOne({
                attributes: ["name", "numberOfSessions"],
                where: {
                    instructorId: tutor.id,
                    id: data.teachingSubjectId,
                },
            });

            const lessons = await Lesson.findOne({
                where: {
                    teachingSubjectId: data.teachingSubjectId,
                    date: date,
                    startTime: {
                        [Op.between]: [data.startTime, teachingTime],
                    },
                },
            });
            if (lessons) {
                responseMessageInstance.throwError(
                    `A lesson is already scheduled at the specified ${lessons.startTime}. `,
                    400
                );
            }
            if (!course) {
                responseMessageInstance.throwError("Course not found!", 404);
            }

            await Lesson.create({
                title: data.title,
                date: date,
                startTime: data.startTime,
                duration: data.duration,
                teachingSubjectId: data.teachingSubjectId,
            });
            //mail thong bao co lesson moi
            ///////////////////////////////////////////////////////////////////////
            return responseMessageInstance.getSuccess(
                res,
                200,
                "Create lesson successful"
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
    async ChangStatusCourse(req, res) {
        try {
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
