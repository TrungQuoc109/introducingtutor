import dotenv from "dotenv";
import {
    Lesson,
    Location,
    Subject,
    TeachingSubject,
    Tutor,
    TutorSubjectMap,
    User,
} from "../model/index.js";
import { responseMessageInstance } from "../utils/index.js";
import {
    COURSE_STATUS,
    CredentialsValidation,
    ROLE,
    STATUS,
    validationRules,
} from "../constants/index.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";
import { calculateEndDate } from "../utils/validate.js";
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
            const userId = req.userId;
            const role = req.role;
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
            const subjectsModel = await TutorSubjectMap.findAll({
                attributes: ["subjectId"],
                include: [
                    {
                        model: Tutor,
                        attributes: ["id"],
                        where: { userId: userId },
                    },
                    { model: Subject },
                ],
            });
            const subjects = subjectsModel.map((item) => item.Subject);
            if (location.length == 0) {
                responseMessageInstance.throwError("Location not found!", 404);
            }
            return responseMessageInstance.getSuccess(res, 200, "successful", {
                data: { location, subjects },
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
            const data = req.body.data ?? {};

            const userId = req.userId;
            const role = req.role;
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

            if (data.name.length == 0 || data.name.length > 255) {
                responseMessageInstance.throwError(
                    "Tên khóa học không hợp lệ.",
                    400
                );
            }
            if (data.description.length == 0) {
                responseMessageInstance.throwError(
                    "Địa chỉ khóa học không hợp lệ.",
                    400
                );
            }
            if (data.specificAddress.length == 0) {
                responseMessageInstance.throwError(
                    "Mô tả khóa học không hợp lệ.",
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
                include: [{ model: User, attributes: ["status"] }],
                where: { userId: userId },
            });
            if (!tutor) {
                responseMessageInstance.throwError(
                    "Không tìm thấy gia sư!",
                    404
                );
            }
            if (tutor.User.status == STATUS.pendingApproval) {
                responseMessageInstance.throwError(
                    "Bạn chưa được duyệt để tạo khoá học",
                    400
                );
            }
            data.instructorId = tutor.id;
            const subject = await Subject.findOne({
                include: [
                    {
                        model: TutorSubjectMap,
                        where: {
                            subjectId: data.subjectId,
                            tutorId: tutor.id,
                        },
                    },
                ],
            });

            const location = await Location.findOne({
                where: { districtsId: data.location, tutorId: tutor.id },
            });
            if (!subject) {
                responseMessageInstance.throwError(
                    "Gia sư không đăng ký dạy môn này",
                    404
                );
            }
            if (!location) {
                responseMessageInstance.throwError(
                    "Gia sư không đăng ký dạy ở khu vực này ",
                    400
                );
            }

            const course = await TeachingSubject.create(data);

            return responseMessageInstance.getSuccess(
                res,
                200,
                "Tạo khóa học thành công",
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
            const data = req.body ?? {};
            const lessonTimes = [90, 120, 150, 180];

            const userId = req.userId;
            const role = req.role;
            if (!role || role != ROLE.tutor) {
                responseMessageInstance.throwError("Unauthorized", 401);
            }
            if (
                !data ||
                (typeof data === "object" && Object.keys(data).length === 0)
            ) {
                responseMessageInstance.throwError("Invalid data.", 400);
            }

            if (data.dayOfWeek < 2 || data.dayOfWeek > 8) {
                responseMessageInstance.throwError("Thứ không hợp lệ", 400);
            }
            const newLessonStart = new Date();
            const [hour, minutes, second] = data.startTime
                .split(":")
                .map(Number);
            const startLimit = new Date(newLessonStart);
            startLimit.setHours(7, 0, 0, 0);
            const endLimit = new Date(newLessonStart);
            endLimit.setHours(19, 0, 0, 0);
            newLessonStart.setHours(hour, minutes, second, 0);
            if (newLessonStart < startLimit || newLessonStart > endLimit) {
                responseMessageInstance.throwError(
                    "Giờ bắt đầu không hợp lệ",
                    400
                );
            }

            if (!lessonTimes.some((item) => item == data.duration)) {
                responseMessageInstance.throwError(
                    "Thời lượng buổi học không hợp lệ",
                    400
                );
            }

            const tutor = await Tutor.findOne({
                attributes: ["id"],
                where: { userId: userId },
            });

            if (!tutor) {
                responseMessageInstance.throwError(
                    "Không tìm thấy gia sư",
                    404
                );
            }
            const course = await TeachingSubject.findOne({
                attributes: ["name", "startDate", "numberOfSessions"],
                include: [
                    {
                        model: Lesson,
                    },
                ],
                where: {
                    id: data.courseId,
                    status: {
                        [Op.and]: [
                            { [Op.ne]: COURSE_STATUS.disabledCourse },
                            { [Op.ne]: COURSE_STATUS.completedCourse },
                        ],
                    },
                },
            });
            if (!course) {
                responseMessageInstance.throwError(
                    "Không tìm thấy khóa học",
                    404
                );
            }
            const now = new Date();

            const endDate = calculateEndDate(
                course.startDate,
                course.numberOfSessions,
                course.Lessons.length == 0 ? 1 : course.Lessons.length
            );

            const startTime = data.startTime;
            if (now > course.startDate) {
                responseMessageInstance.throwError(
                    "Bạn không thể tạo thêm buổi học khi khoá học đã bắt đầu",
                    400
                );
            }
            const startTimeUTC = new Date(`1970-01-01T${data.startTime}Z`);
            const endTimeUTC = new Date(
                startTimeUTC.getTime() + data.duration * 60 * 1000
            );
            const isCourseActive = await TeachingSubject.findAll({
                attributes: ["id", "numberOfSessions", "startDate"],
                include: [{ model: Lesson, attributes: ["id"] }],
                where: {
                    instructorId: tutor.id,
                    status: {
                        [Op.and]: [
                            { [Op.ne]: COURSE_STATUS.disabledCourse },
                            { [Op.ne]: COURSE_STATUS.completedCourse },
                        ],
                    },
                },
            });
            const filteredCourses = isCourseActive.filter((courseActive) => {
                const startDate = courseActive.startDate;
                const endDateOfCourseActive = calculateEndDate(
                    courseActive.startDate,
                    courseActive.numberOfSessions,
                    courseActive.Lessons.length == 0
                        ? 1
                        : courseActive.Lessons.length
                );

                return (
                    (startDate >= course.startDate && startDate <= endDate) ||
                    (course.startDate >= startDate &&
                        course.startDate <= endDateOfCourseActive)
                );
            });

            const conflictingLessons = await Promise.all(
                filteredCourses.map(async (courseInRange) => {
                    try {
                        const lessons = await Lesson.findOne({
                            where: {
                                dayOfWeek: data.dayOfWeek,
                                teachingSubjectId: courseInRange.id,
                                [Op.or]: [
                                    {
                                        startTime: {
                                            [Op.between]: [
                                                startTime,
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

                        return lessons;
                    } catch (error) {
                        console.error("Error fetching lessons:", error);
                        throw error;
                    }
                })
            );

            conflictingLessons.forEach((item) => {
                if (item != null) {
                    responseMessageInstance.throwError(
                        `Đã có buổi học vào  ${item.startTime} thứ ${item.dayOfWeek}. `,
                        400
                    );
                }
            });
            const countLesson = await Lesson.count({
                where: { teachingSubjectId: data.courseId },
            });

            if (countLesson >= course.numberOfSessions) {
                responseMessageInstance.throwError(
                    "Số buổi học không nhiều hơn số buổi của khóa học",
                    400
                );
            }
            await Lesson.create({
                dayOfWeek: data.dayOfWeek,
                startTime: data.startTime,
                duration: data.duration,
                teachingSubjectId: data.courseId,
            });

            return responseMessageInstance.getSuccess(
                res,
                200,
                "Tạo buổi học thành công"
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
            const { courseId, status } = req.body ?? {};

            const userId = req.userId;
            const role = req.role;

            if (!role || role != ROLE.tutor) {
                responseMessageInstance.throwError("Unauthorized", 401);
            }
            const isValidStatus = Object.values(COURSE_STATUS).includes(status);
            if (!isValidStatus) {
                responseMessageInstance.throwError(
                    "Trạng thái khóa học không hợp lệ"
                );
            }
            const tutor = await Tutor.findOne({
                attributes: ["id"],
                where: { userId: userId },
            });

            if (!tutor) {
                responseMessageInstance.throwError(
                    "Không tìm thấy gia sư",
                    404
                );
            }
            const course = await TeachingSubject.findOne({
                include: [{ model: Lesson }],
                where: {
                    id: courseId,
                },
            });
            if (!course) {
                responseMessageInstance.throwError(
                    "Không tìm thấy khóa học",
                    404
                );
            }
            if (course.status == COURSE_STATUS.disabledCourse) {
                responseMessageInstance.throwError(
                    "Khoá học đã bị vô hiệu hoá",
                    400
                );
            }
            course.status = status;

            if (status == 1 && course.Lessons.length == 0) {
                responseMessageInstance.throwError(
                    "Phải tạo ít nhất 1 buổi học trước khi mở đăng ký!",
                    400
                );
            }
            await course.save();
            return responseMessageInstance.getSuccess(
                res,
                200,
                "Cập nhật trạng thái khóa học thành công"
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
    async UpdateCourse(req, res) {
        try {
            const course = req.body.data;
            delete course.Tutor;
            delete course.Subject;

            const userId = req.userId;
            const role = req.role;
            if (!role || role != ROLE.tutor) {
                responseMessageInstance.throwError(
                    "Bạn không có quyền truy cập!",
                    401
                );
            }

            if (
                !course ||
                (typeof course === "object" && Object.keys(course).length === 0)
            ) {
                responseMessageInstance.throwError(
                    "Thông tin khoá học không hợp lệ.",
                    400
                );
            }
            course.startDate = new Date(course.startDate);

            if (course.name.length == 0 || course.name.length > 255) {
                responseMessageInstance.throwError(
                    "Tên khóa học không hợp lệ.",
                    400
                );
            }
            if (course.description.length == 0) {
                responseMessageInstance.throwError(
                    "Địa chỉ khóa học không hợp lệ.",
                    400
                );
            }
            if (course.specificAddress.length == 0) {
                responseMessageInstance.throwError(
                    "Mô tả khóa học không hợp lệ.",
                    400
                );
            }
            validationRules.forEach((rule) => {
                if (rule.type != "date")
                    if (
                        !course[rule.field] ||
                        !CredentialsValidation(rule.type, course[rule.field])
                    ) {
                        responseMessageInstance.throwError(
                            rule.errorMessage,
                            400
                        );
                    }
            });
            const tutor = await Tutor.findOne({
                attributes: ["id"],
                where: { userId },
            });
            if (!tutor) {
                responseMessageInstance.throwError(
                    "Không tìm thấy gia sư",
                    404
                );
            }
            const existedCourse = await TeachingSubject.findOne({
                where: {
                    id: course.id,
                },
            });
            if (!existedCourse) {
                responseMessageInstance.throwError(
                    "Không tìm thấy khóa học",
                    404
                );
            }
            if (existedCourse.status == COURSE_STATUS.disabledCourse) {
                responseMessageInstance.throwError(
                    "Khoá học đã bị vô hiệu hoá",
                    400
                );
            }
            const now = new Date();
            if (existedCourse.startDate >= now) {
                responseMessageInstance.throwError(
                    "Không được phép cập nhật khoá học khi đã bắt đầu giảng dạy",
                    400
                );
            }
            if (existedCourse.startDate != course.startDate) {
                const lesson = await Lesson.findOne({
                    where: { teachingSubjectId: existedCourse.id },
                });
                if (lesson) {
                    responseMessageInstance.throwError(
                        "Vui lòng xoá các buổi học trước khi cập nhật ngày bắt đầu!",
                        400
                    );
                }
            }
            await existedCourse.update(course);

            return responseMessageInstance.getSuccess(
                res,
                200,
                "Cập nhật khoá học thành công"
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
    async DeleteLesson(req, res) {
        try {
            const userId = req.userId;
            const role = req.role;
            const { courseId, lessonId } = req.body ?? {};
            if (!role || role != ROLE.tutor) {
                responseMessageInstance.throwError(
                    "Bạn không có quyền truy cập!",
                    401
                );
            }
            if (!courseId || !lessonId) {
                responseMessageInstance("Invalid courseId or lessonId");
            }
            const tutor = await Tutor.findOne({ where: { userId: userId } });
            if (!tutor) {
                responseMessageInstance.throwError(
                    "Không tìm thấy gia sư",
                    404
                );
            }
            const course = await TeachingSubject.findByPk(courseId);
            if (!course) {
                responseMessageInstance.throwError(
                    "Không tìm thấy khoá học",
                    404
                );
            }
            const lesson = await Lesson.findByPk(lessonId);
            if (!lesson) {
                responseMessageInstance.throwError(
                    "Không tìm thấy buổi học",
                    404
                );
            }
            const now = new Date();
            if (course.startDate < now) {
                responseMessageInstance.throwError(
                    "Bạn không thể xoá buổi học khi khoá học đã bắt đầu",
                    400
                );
            }
            await lesson.destroy();
            return responseMessageInstance.getSuccess(
                res,
                200,
                "Xoá buổi học thành công"
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
