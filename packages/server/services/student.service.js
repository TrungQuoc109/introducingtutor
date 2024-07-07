import dotenv from "dotenv";
import {
    COURSE_STATUS,
    PAYMENT_STATUS,
    ROLE,
    districts,
    momoConfig,
    momoUrl,
} from "../constants/index.js";
import crypto from "crypto";
import axios from "axios";
import { responseMessageInstance } from "../utils/index.js";
import { Student } from "../model/student.model.js";

import { TeachingSubject } from "../model/teachingSubject.model.js";
import { calculateEndDate, formatDate } from "../utils/validate.js";
import { Lesson } from "../model/lesson.model.js";
import { StudentTeachingSubjectMap } from "../model/studentSubjectMap.model.js";
import { Op } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";
import nodemailer from "nodemailer";
import { User } from "../model/user.model.js";
import { Tutor } from "../model/tutor.model.js";
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

            const userId = req.userId;
            const role = req.role;
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

            const isCoursePending = await StudentTeachingSubjectMap.findOne({
                where: {
                    teachingSubjectId: courseId,
                    studentId: student.id,
                    status: PAYMENT_STATUS.PENDING_PAYMENT,
                },
            });
            if (isCoursePending && isCoursePending.status == 0) {
                responseMessageInstance.throwError(
                    "Bạn đã đăng ký khoá học này rồi!",
                    400
                );
            }
            let conflictingLessons;
            if (!isCoursePending) {
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
                console.log("test", registeredCourses.dataValues);
                const filteredCourses = registeredCourses.filter(
                    (registerCourse) => {
                        const startDateOfregisterCourse =
                            registerCourse.startDate;
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

                conflictingLessons = await Promise.all(
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
                                    (course) =>
                                        course.id == item.teachingSubjectId
                                ).name
                            }.`,
                            400
                        );
                    }
                });
            }

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

            const options = {
                url: `${momoUrl}/create`,
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

                if (!isCoursePending) {
                    const test = await StudentTeachingSubjectMap.create(data);
                    console.log(test.dataValues);
                } else isCoursePending.update({ orderId: orderId });
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
            const orderId = req.body.orderId ?? "";

            const userId = req.userId;
            const role = req.role;
            if (!role || role != ROLE.student) {
                responseMessageInstance.throwError(
                    "Bạn không phải là học sinh",
                    401
                );
            }

            const student = await Student.findOne({
                include: [{ model: User, attributes: ["email", "name"] }],
                where: { userId },
            });
            if (!student) {
                responseMessageInstance.throwError("Student not found!", 404);
            }
            const order = await StudentTeachingSubjectMap.findOne({
                where: { orderId: orderId },
            });
            if (!order) {
                responseMessageInstance.throwError("Order not found!", 404);
            }
            const course = await TeachingSubject.findOne({
                include: [
                    {
                        model: Tutor,
                        attributes: ["id"],
                        include: [{ model: User }],
                    },
                ],
                where: { id: order.teachingSubjectId },
            });
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
                url: `${momoUrl}/query`,
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

                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.EMAIL_ADDRESS,
                            pass: process.env.EMAIL_PASSWORD,
                        },
                    });
                    const startDate = formatDate(course.startDate);
                    const mailOptions = {
                        from: process.env.EMAIL_ADDRESS,
                        to: process.env.EMAIL_ADDRESS, //student.User.email,
                        subject: `Đăng ký khoá học ${course.name}`,
                        html: `
    <div>
        <p>Thân gửi ${student.User.name},</p>
        <p>Chúng tôi rất vui mừng thông báo rằng bạn đã đăng ký thành công khóa học ${
            course.name
        }.</p>
        <p>Thông tin khóa học:</p>
        <ul>
            <li>Tên khóa học: ${course.name}.</li>
            <li>Ngày bắt đầu: ${startDate}.</li>
            <li>Địa điểm: ${course.specificAddress}, ${
                            districts.find(
                                (district) => district.id == course.location
                            )?.name
                        }.</li>
        </ul>
        <p>Thông tin liên lạc với gia sư</p>
        <ul>
            <li>Tên gia sư: ${course.Tutor.User.name}.</li>
            <li>Số điện thoại: ${course.Tutor.User.phoneNumber}.</li>
            <li>Email: ${course.Tutor.User.email}.</li>
        </ul>

        <p>Chúng tôi hy vọng bạn sẽ có trải nghiệm học tập tuyệt vời và đạt được những kiến thức hữu ích từ khóa học.</p>
        <p>Chúc bạn thành công!</p>
        <p>Trân trọng,<br/>Introducing Tutor<br/>${
            process.env.EMAIL_ADDRESS
        }</p>
    </div>
`,
                    };
                    transporter.sendMail(mailOptions, (error) => {
                        if (error) {
                            responseMessageInstance.throwError(
                                `There was an error while sending the email. ${error}`,
                                500
                            );
                        }
                    });
                    console.log("order:", order.dataValues);
                    return responseMessageInstance.getSuccess(
                        res,
                        200,
                        result.data.message
                    );
                }
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
    async CancelCourse(req, res) {
        try {
            const courseId = req.body.courseId ?? "";

            const userId = req.userId;
            const role = req.role;
            if (!role || role != ROLE.student) {
                responseMessageInstance.throwError(
                    "Bạn không phải là học sinh",
                    401
                );
            }
            const student = await Student.findOne({ where: { userId } });
            if (!student) {
                responseMessageInstance.throwError(
                    "Không tìm thấy học sinh này",
                    404
                );
            }

            const course = await TeachingSubject.findByPk(courseId, {
                include: [{ model: Lesson }],
            });
            if (!course) {
                responseMessageInstance.throwError(
                    "Không tìm thấy khoá học",
                    404
                );
            }
            const order = await StudentTeachingSubjectMap.findOne({
                where: {
                    studentId: student.id,
                    teachingSubjectId: course.id,
                    status: { [Op.ne]: 2 },
                },
            });
            if (!order) {
                responseMessageInstance.throwError(
                    "Bạn chưa đăng ký khoá học này!",
                    404
                );
            }
            if (order.status == PAYMENT_STATUS.REGISTRATION_CANCELLED) {
                responseMessageInstance.throwError(
                    "Khoá học đã được huỷ đăng ký trước đó",
                    400
                );
            }
            let amount = 0;
            if (order.status == PAYMENT_STATUS.PENDING_PAYMENT) {
                order.status = PAYMENT_STATUS.REGISTRATION_CANCELLED;
                await order.save();
            } else {
                const startDate = new Date(course.startDate);
                const now = new Date();
                const daysUntilCourseStart = Math.ceil(
                    (startDate - now) / (24 * 60 * 60 * 1000)
                );

                let refundRate = 0;
                if (daysUntilCourseStart > 7) refundRate = 1;
                else if (daysUntilCourseStart >= 3) refundRate = 0.75;
                else if (daysUntilCourseStart >= 0) refundRate = 0.5;

                if (refundRate != 0) {
                    const orderId =
                        momoConfig.partnerCode + new Date().getTime();
                    const transId = order.transId;
                    const description = `Huỷ đăng ký khoá học ${course.name}`;
                    amount = Math.round(order.amount * refundRate);
                    const rawSignature =
                        "accessKey=" +
                        momoConfig.accessKey +
                        "&amount=" +
                        amount +
                        "&description=" +
                        description +
                        "&orderId=" +
                        orderId +
                        "&partnerCode=" +
                        momoConfig.partnerCode +
                        "&requestId=" +
                        orderId +
                        "&transId=" +
                        transId;
                    const signature = crypto
                        .createHmac("sha256", momoConfig.secretKey)
                        .update(rawSignature)
                        .digest("hex");
                    console.log(signature, rawSignature);
                    const requestBody = JSON.stringify({
                        partnerCode: momoConfig.partnerCode,
                        orderId: orderId,
                        requestId: orderId,
                        amount: amount,
                        transId: transId,
                        lang: "vi",
                        description: description,
                        signature: signature,
                    });
                    const options = {
                        url: `${momoUrl}/refund`,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Content-Length": Buffer.byteLength(requestBody),
                        },
                        data: requestBody,
                    };
                    const result = await axios(options);
                    if (result.status == 200) {
                        order.amount = order.amount - amount;
                        order.status = PAYMENT_STATUS.REGISTRATION_CANCELLED;
                        await order.save();
                    }
                }
            }
            return responseMessageInstance.getSuccess(
                res,
                200,
                `Huỷ thành công, số tiền hoàn lại là ${amount}`
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
