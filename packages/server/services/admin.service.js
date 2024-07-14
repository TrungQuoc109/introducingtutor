import dotenv from "dotenv";
import { responseMessageInstance } from "../utils/index.js";
import {
    Location,
    Student,
    StudentTeachingSubjectMap,
    Subject,
    TeachingSubject,
    Tutor,
    TutorSubjectMap,
    User,
} from "../model/index.js";
import { ROLE, STATUS } from "../constants/index.js";
import { Op, literal } from "sequelize";
dotenv.config();
export class AdminService {
    static instance;
    static getInstance() {
        if (!this.instance) {
            this.instance = new AdminService();
        }
        return this.instance;
    }
    async GetListUsers(req, res) {
        try {
            const {
                page = 0,
                role,
                status,
                district,
                subject,
                searchText,
            } = req.query;
            const limit = 20;

            const whereClause = { role: { [Op.ne]: 0 } };
            if (role) {
                whereClause.role = role;
            }
            if (status) {
                whereClause.status = status;
            }
            if (searchText) {
                whereClause.name = {
                    [Op.iLike]: `%${searchText}%`,
                };
            }
            const tutorInclude = {
                model: Tutor,
                include: [],
            };

            if (subject) {
                tutorInclude.include.push({
                    model: TutorSubjectMap,
                    attributes: ["id"],

                    where: { subjectId: subject },
                });
            }

            if (district) {
                tutorInclude.include.push({
                    model: Location,
                    attributes: ["districtsId", "name"],
                    where: { districtsId: district },
                });
            }

            const { count, rows: users } = await User.findAndCountAll({
                attributes: [
                    "id",
                    "name",
                    "email",
                    "phoneNumber",
                    "age",
                    "status",
                    "role",
                ],
                include: [tutorInclude],
                where: whereClause,
                limit: limit,
                offset: page * limit,
            });

            return responseMessageInstance.getSuccess(
                res,
                200,
                "Get profile successful",
                {
                    data: { users, page: Math.ceil(count / limit) },
                }
            );
        } catch (error) {
            console.error("Error in GetListUsers:", error);
            return responseMessageInstance.getError(
                res,
                error.code ?? 500,
                error.message
            );
        }
    }

    async ChangeStatusUser(req, res) {
        try {
            const userId = req.params.userId;
            const status = req.body.newStatus;
            if (!userId) {
                responseMessageInstance.throwError("Invalid UserId", 400);
            }
            if (status != STATUS.active && status != STATUS.deactive) {
                responseMessageInstance.throwError("Invalid Status", 400);
            }
            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                responseMessageInstance.throwError("User not found!", 404);
            }
            if (user.status == status) {
                responseMessageInstance.throwError("Nothing has changed.", 303);
            }
            await User.update({ status: status }, { where: { id: userId } });
            return responseMessageInstance.getSuccess(
                res,
                200,
                "Change status user  successfull"
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
    async GetProfileUser(req, res) {
        try {
            const userId = req.params.userId;

            const user = await User.findByPk(userId, {
                attributes: [
                    "name",
                    "email",
                    "phoneNumber",
                    "age",
                    "role",
                    "status",
                ],
                include: [
                    {
                        model: Tutor,
                        attributes: ["experience", "education", "id"],
                        required: false,
                    },
                    { model: Student, attributes: ["gradeLevel", "id"] },
                ],
                raw: true,
                nest: true,
            });
            if (user.role == ROLE.tutor) {
                const subjects = await TutorSubjectMap.findAll({
                    attributes: ["subjectId"],
                    where: { tutorId: user.Tutor.id },
                });
                const locations = await Location.findAll({
                    attributes: ["districtsId", "name"],
                    where: { tutorId: user.Tutor.id },
                });
                const courses = await TeachingSubject.findAll({
                    attributes: ["name"],
                    where: { instructorId: user.Tutor.id },
                });

                user.courses = courses;
                user.subjects = subjects;
                user.locations = locations;
            } else {
                const registerCourse = await TeachingSubject.findAll({
                    attributes: ["name"],
                    include: [
                        {
                            model: StudentTeachingSubjectMap,
                            attributes: [],
                            where: { studentId: user.Student.id },
                        },
                    ],
                });
                user.courses = registerCourse;
            }

            return responseMessageInstance.getSuccess(res, 200, "Succesful", {
                user,
            });
        } catch (error) {
            console.error("Error in GetListUsers:", error);
            return responseMessageInstance.getError(
                res,
                error.code ?? 500,
                error.message
            );
        }
    }
    async GetListCourses(req, res) {
        try {
            const {
                page = 0,

                status,
                district,
                subject,
                searchText,
            } = req.query;
            const limit = 20;

            const whereClause = {};

            if (status) {
                whereClause.status = status;
            }
            if (searchText) {
                whereClause[Op.or] = [
                    {
                        name: {
                            [Op.iLike]: `%${searchText}%`,
                        },
                    },
                    {
                        description: {
                            [Op.iLike]: `%${searchText}%`,
                        },
                    },
                ];
            }
            const includeSubject = {
                model: Subject,
                attributes: ["id", "name"],
            };
            if (subject) {
                includeSubject.where = { id: subject };
            }

            if (district) {
                whereClause.location = district;
            }

            const { count, rows: courses } =
                await TeachingSubject.findAndCountAll({
                    attributes: ["id", "name", "price", "status"],
                    include: [
                        includeSubject,
                        {
                            model: Tutor,
                            attributes: ["id"],
                            include: [{ model: User, attributes: ["name"] }],
                        },
                    ],
                    where: whereClause,
                    limit: limit,
                    offset: page * limit,
                });

            return responseMessageInstance.getSuccess(
                res,
                200,
                "Get profile successful",
                {
                    data: { courses, page: Math.ceil(count / limit) },
                }
            );
        } catch (error) {
            console.error("Error in GetListUsers:", error);
            return responseMessageInstance.getError(
                res,
                error.code ?? 500,
                error.message
            );
        }
    }
}

export const adminServiceInstance = AdminService.getInstance();
