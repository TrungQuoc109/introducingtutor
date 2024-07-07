import dotenv from "dotenv";
import { responseMessageInstance } from "../utils/index.js";
import {
    Location,
    Subject,
    Tutor,
    TutorSubjectMap,
    User,
} from "../model/index.js";
import { STATUS } from "../constants/index.js";
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
}

export const adminServiceInstance = AdminService.getInstance();
