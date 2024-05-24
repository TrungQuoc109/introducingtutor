import dotenv from "dotenv";
import { responseMessageInstance } from "../utils/index.js";
import { User } from "../model/index.js";
import { ROLE, STATUS } from "../constants/index.js";
import { Op } from "sequelize";
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
            const users = await User.findAll({
                attributes: [
                    "id",
                    "name",
                    "email",
                    "phoneNumber",
                    "age",
                    "status",
                    "role",
                ],
                where: { role: { [Op.ne]: 0 }, status: { [Op.ne]: 0 } },
            });
            if (!users) {
                responseMessageInstance.throwError("User not found!", 404);
            }

            return responseMessageInstance.getSuccess(
                res,
                200,
                "Get profile successfull",
                {
                    data: users,
                }
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
    async ChangeStatusUser(req, res) {
        try {
            const userId = req.params.userId;
            const status = req.body.status;
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
