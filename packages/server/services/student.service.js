import dotenv from "dotenv";
import {
    COURSE_STATUS,
    PAYMENT_STATUS,
    ROLE,
    momoConfig,
} from "../constants/index.js";
import crypto from "crypto";
import axios from "axios";
import { responseMessageInstance } from "../utils/index.js";
import { Student } from "../model/student.model.js";
import jwt from "jsonwebtoken";
import { TeachingSubject } from "../model/teachingSubject.model.js";
import { calculateEndDate } from "../utils/validate.js";
import { Lesson } from "../model/lesson.model.js";
import { StudentTeachingSubjectMap } from "../model/studentSubjectMap.model.js";
import { Op, where } from "sequelize";
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

    async RegisterCourse(req, res) {
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
                responseMessageInstance.throwError(
                    "Bạn không phải là học sinh",
                    401
                );
            }

            const student = await Student.findOne({ where: { userId } });
            if (!student) {
                responseMessageInstance.throwError("Student not found!", 404);
            }

            const course = await TeachingSubject.findByPk(courseId, {
                include: [{ model: Lesson }],
            });
            if (!course) {
                responseMessageInstance.throwError("Course not found!", 404);
            }

            const startDate = course.startDate;
            const endDate = calculateEndDate(
                startDate,
                course.numberOfSessions,
                course.Lessons.lenght == 0 ? 1 : course.Lessons.lenght
            );

            const registeredCourses = await TeachingSubject.findAll({
                include: [
                    {
                        model: StudentTeachingSubjectMap,
                        where: {
                            studentId: student.id,
                            status: PAYMENT_STATUS.REGISTRATION_SUCCESS,
                        },
                    },
                    { model: Lesson },
                ],
                where: {
                    status: {
                        [Op.and]: [
                            { [Op.ne]: COURSE_STATUS.disabledCourse },
                            { [Op.ne]: COURSE_STATUS.completedCourse },
                        ],
                    },
                },
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
                            course.Lessons.map(async (lesson) => {
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

            const flattenedConflictingLessons = conflictingLessons.flat();

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

            const requestId = momoConfig.partnerCode + new Date().getTime();
            const orderId = requestId;
            const orderInfo = `Đăng ký khóa ${course.name}`;
            const amount = course.price;
            const rawSignature =
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

            const signature = crypto
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
            console.log(signature);
            const options = {
                url: "https://test-payment.momo.vn/v2/gateway/api/create",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(requestBody),
                },
                data: requestBody,
            };

            const result = await axios(options);

            if (result.status == 200) {
                const data = {
                    studentId: student.id,
                    teachingSubjectId: course.id,
                    orderId: orderId,
                    amount: amount,
                };
                console.log(data);
                await StudentTeachingSubjectMap.create(data);
                return responseMessageInstance.getSuccess(
                    res,
                    200,
                    "succesful",
                    {
                        data: result.data,
                    }
                );
            }
            responseMessageInstance.throwError(
                "Có lỗi trong quá trình xử lý",
                500
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
    async ConfirmRegisterCourse(req, res) {
        try {
            console.log(req.body);
            const orderId = req.body.orderId ?? "";
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
                responseMessageInstance.throwError(
                    "Bạn không phải là học sinh",
                    401
                );
            }

            const student = await Student.findOne({ where: { userId } });
            if (!student) {
                responseMessageInstance.throwError("Student not found!", 404);
            }
            const order = await StudentTeachingSubjectMap.findOne({
                where: { orderId: orderId },
            });
            if (!order) {
                responseMessageInstance.throwError("Order not found!", 404);
            }
            //     const requestId = momoConfig.partnerCode + new Date().getTime();

            const rawSignature = `accessKey=${momoConfig.accessKey}&orderId=${orderId}&partnerCode=${momoConfig.partnerCode}&requestId=${orderId}`;

            const signature = crypto
                .createHmac("sha256", momoConfig.secretKey)
                .update(rawSignature)
                .digest("hex");
            const requestBody = JSON.stringify({
                partnerCode: momoConfig.partnerCode,
                orderId: orderId,
                requestId: orderId,
                signature: signature,
                lang: "vi",
            });

            const options = {
                url: "https://test-payment.momo.vn/v2/gateway/api/query",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(requestBody),
                },
                data: requestBody,
            };

            const result = await axios(options);

            if (result.status == 200) {
                const code = result.data.resultCode;
                const transId = result.data.transId;
                if (code > 1000) {
                    await StudentTeachingSubjectMap.destroy({
                        where: { orderId: orderId },
                    });
                }
                if (code == 0) {
                    order.status = 0;
                    order.transId = transId;
                    await order.save();
                }

                return responseMessageInstance.getSuccess(
                    res,
                    200,
                    result.data.message
                );
            }
            responseMessageInstance.throwError(
                "Có lỗi trong quá trình xử lý",
                500
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

export const studentServiceInstance = StudentService.getInstance();
