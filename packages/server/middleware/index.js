import { ROLE } from "../constants/index.js";
import { responseMessageInstance } from "../utils/index.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
export class Middleware {
    static instance;

    static getInstance() {
        if (!this.instance) {
            return this.instance;
        }
    }
    AdminAuthen(req, res, next) {
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

            const userRole = decodedToken.role;
            if (userRole != ROLE.admin) {
                responseMessageInstance.throwError("Unauthorized", 401);
            }
            next();
        } catch (error) {
            console.log(error);
            console.log(error);
            if (error instanceof jwt.JsonWebTokenError) {
                return responseMessageInstance.getError(
                    res,
                    401,
                    "Invalid access token"
                );
            } else if (error instanceof jwt.TokenExpiredError) {
                return responseMessageInstance.getError(
                    res,
                    401,
                    "Access token has expired"
                );
            } else {
                return responseMessageInstance.getError(
                    res,
                    error.code ?? 500,
                    error.message
                );
            }
        }
    }
    Authen(req, res, next) {
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

            next();
        } catch (error) {
            console.log(error);
            if (error instanceof jwt.JsonWebTokenError) {
                return responseMessageInstance.getError(
                    res,
                    401,
                    "Invalid access token"
                );
            } else if (error instanceof jwt.TokenExpiredError) {
                return responseMessageInstance.getError(
                    res,
                    401,
                    "Access token has expired"
                );
            } else {
                return responseMessageInstance.getError(
                    res,
                    error.code ?? 500,
                    error.message
                );
            }
        }
    }
}
export const middlewareInstance = new Middleware();
