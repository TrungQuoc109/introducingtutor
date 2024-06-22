import dotenv from "dotenv";
import { COURSE_STATUS, ROLE, momoConfig } from "../constants/index.js";
import crypto from "crypto";
import axios from "axios";
import { responseMessageInstance } from "../utils/index.js";
import { Student } from "../model/student.model.js";
import jwt from "jsonwebtoken";
import { TeachingSubject } from "../model/teachingSubject.model.js";
import { calculateEndDate } from "../utils/validate.js";
import { Lesson } from "../model/lesson.model.js";
import { StudentTeachingSubjectMap } from "../model/studentSubjectMap.model.js";
import { Op } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";
dotenv.config();
export class StudentService {
    static instance;
    static getInstance() {
        if (!this.instance) {
            this.instance = new StudentService();
        }
        return this.instance;
    }

    async payment(req, res) {
        try {
            const courseId = req.body ?? "";
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
            if (!role || role != ROLE.student) {
                responseMessageInstance.throwError("Unauthorized", 401);
            }

            const student = await Student.findOne({ where: { userId } });

            var requestId = momoConfig.partnerCode + new Date().getTime();
            var orderId = requestId;
            var orderInfo = "pay with MoMo";
            var amount = courseOrder.price;
            var rawSignature =
                "accessKey=" +
                momoConfig.accessKey +
                "&amount=" +
                amount +
                "&extraData=" +
                momoConfig.extraData +
                "&ipnUrl=" +
                momoConfig.ipnUrl +
                "&orderId=" +
                orderId +
                "&orderInfo=" +
                orderInfo +
                "&partnerCode=" +
                momoConfig.partnerCode +
                "&redirectUrl=" +
                momoConfig.redirectUrl +
                "&requestId=" +
                requestId +
                "&requestType=" +
                momoConfig.requestType;

            var signature = crypto
                .createHmac("sha256", momoConfig.secretKey)
                .update(rawSignature)
                .digest("hex");

            const requestBody = JSON.stringify({
                partnerCode: momoConfig.partnerCode,
                accessKey: momoConfig.accessKey,
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: momoConfig.redirectUrl,
                ipnUrl: momoConfig.ipnUrl,
                extraData: momoConfig.extraData,
                requestType: momoConfig.requestType,
                signature: signature,
                lang: "en",
            });

            const options = {
                url: "https://test-payment.momo.vn/v2/gateway/api/create",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(requestBody),
                },
                data: requestBody,
            };
            //Send the request and get the response

            const result = await axios(options);
            return responseMessageInstance.getSuccess(res, 200, "succesful", {
                data: result.data,
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
    async registerCourse(req, res) {
        try {
            const courseId = req.body.courseId ?? "";
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
            if (!role || role != ROLE.student) {
                responseMessageInstance.throwError("Unauthorized", 401);
            }

            //check student
            const student = await Student.findOne({ where: { userId } });
            if (!student) {
                responseMessageInstance.throwError("Student not found!", 404);
            }
            //get course and lesson of course
            const course = await TeachingSubject.findByPk(courseId, {
                include: [{ model: Lesson }],
            });
            if (!course) {
                responseMessageInstance.throwError("Course not found!", 404);
            }
            //tinh' thoi gian hoat dong cua khoa hoc
            const startDate = course.startDate;
            const endDate = calculateEndDate(
                startDate,
                course.numberOfSessions,
                course.Lessons.lenght == 0 ? 1 : course.Lessons.lenght
            );
            //get list course student registered
            const registeredCourses = await TeachingSubject.findAll({
                include: [
                    {
                        model: StudentTeachingSubjectMap,
                        where: {
                            studentId: student.id,
                        },
                    },
                    { model: Lesson },
                ],
                where: { status: { [Op.ne]: COURSE_STATUS.disabled } },
            });
            const filteredCourses = registeredCourses.filter(
                (registerCourse) => {
                    const startDateOfregisterCourse = registerCourse.startDate;
                    const endDateOfregisterCourse = calculateEndDate(
                        registerCourse.startDate,
                        registerCourse.numberOfSessions,
                        registerCourse.Lessons.length == 0
                            ? 1
                            : registerCourse.Lessons.length
                    );

                    return (
                        (startDateOfregisterCourse >= startDate &&
                            startDateOfregisterCourse <= endDate) ||
                        (startDate >= startDateOfregisterCourse &&
                            startDate <= endDateOfregisterCourse)
                    );
                }
            );
            const conflictingLessons = await Promise.all(
                filteredCourses.map(async (courseInRange) => {
                    try {
                        const lessons = await Promise.all(
                            courseInRange.Lessons.map(async (lesson) => {
                                const startTime = lesson.startTime;
                                const startTimeUTC = new Date(
                                    `1970-01-01T${lesson.startTime}Z`
                                );
                                const endTimeUTC = new Date(
                                    startTimeUTC.getTime() +
                                        lesson.duration * 60 * 1000
                                );
                                return await Lesson.findOne({
                                    attributes: [
                                        "dayOfWeek",
                                        "startTime",
                                        "teachingSubjectId",
                                    ],
                                    where: {
                                        dayOfWeek: lesson.dayOfWeek,
                                        teachingSubjectId: courseInRange.id,
                                        [Op.or]: [
                                            {
                                                startTime: {
                                                    [Op.between]: [
                                                        courseInRange.startTime,
                                                        endTimeUTC,
                                                    ],
                                                },
                                            },
                                            sequelize.literal(
                                                `'${startTime}' BETWEEN "Lesson"."start_time" AND ("Lesson"."start_time" + (duration * INTERVAL '1 minute'))`
                                            ),
                                        ],
                                    },
                                });
                            })
                        );
                        return lessons;
                    } catch (error) {
                        console.error("Error fetching lessons:", error);
                        throw error;
                    }
                })
            );

            // Làm phẳng mảng
            const flattenedConflictingLessons = conflictingLessons.flat();

            // Lặp qua từng phần tử và in thông báo lỗi
            flattenedConflictingLessons.forEach((item) => {
                if (item != null) {
                    responseMessageInstance.throwError(
                        `Đã có buổi học vào ${item.startTime} thứ ${
                            item.dayOfWeek
                        } của khóa học ${
                            registeredCourses.find(
                                (course) => course.id == item.teachingSubjectId
                            ).name
                        }.`,
                        400
                    );
                }
            });
            await StudentTeachingSubjectMap.create({
                studentId: student.id,
                teachingSubjectId: course.id,
            });
            return responseMessageInstance.getSuccess(res, 200, "ok");
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
