import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { responseMessageInstance } from "../utils/index.js";
import {
    CredentialsValidation,
    MAX_GRADEL_LEVEL,
    MIN_GRADEL_LEVEL,
    OTP_LENGTH,
    ROLE,
} from "../constants/index.js";
import { Otp, Student, Tutor, User } from "../model/index.js";
import { findInvalidOrEmptyAttributes } from "../utils/validate.js";
import { Op } from "sequelize";
import nodemailer from "nodemailer";

dotenv.config();

export class UserService {
    static instance;
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserService();
        }
        return this.instance;
    }
    async Login(req, res) {
        try {
            const { username, password } = req.body ?? {};
            if (!username || !password) {
                responseMessageInstance.throwError(
                    "Invalid Username or Password",
                    400
                );
            }
            const isValidUserCredential =
                CredentialsValidation("username", username) &&
                CredentialsValidation("password", password);
            if (!isValidUserCredential) {
                responseMessageInstance.throwError(
                    "Invalid User Credential",
                    400
                );
            }

            const userCredentials = await User.findOne({
                attributes: ["password"],
                where: { username: username },
            });

            if (!userCredentials) {
                responseMessageInstance.throwError(
                    "Login failed. Please check your username or password",
                    400
                );
            }
            const checkpassword = await bcrypt.compare(
                password,
                userCredentials.password
            );
            if (!checkpassword) {
                responseMessageInstance.throwError(
                    "Login failed. Please check your username or password",
                    400
                );
            }

            const authenticatedUser = await User.findOne({
                attributes: ["id", "name", "role", "password", "status"],
                where: {
                    username: username,
                },
            });
            if (authenticatedUser.status == 0) {
                responseMessageInstance.throwError(
                    "Your account has been deactivated.",
                    400
                );
            }
            const payload = {
                userId: authenticatedUser.id,
                role: authenticatedUser.role,
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: "1d",
            });
            const data = {
                name: authenticatedUser.name,
                role: authenticatedUser.role,
                token: token,
            };

            return responseMessageInstance.getSuccess(
                res,
                200,
                "Login successful",
                { data }
            );
        } catch (error) {
            console.log(error.message);
            return responseMessageInstance.getError(
                res,
                error.code ?? 500,
                error.message
            );
        }
    }
    async SendOTP(req, res) {
        try {
            console.log(req.body);
            const email = req.body.email ?? "";
            const username = req.body.username ?? "";
            const action = req.body.action ?? "";

            const isValidEmail = CredentialsValidation("email", email);
            if (!isValidEmail) {
                responseMessageInstance.throwError("Invalid email.");
            }

            const existingEmail = await User.findOne({
                where: {
                    [Op.or]: [{ username: username }, { email: email }],
                },
            });

            if (existingEmail) {
                if (action == "sign-up") {
                    responseMessageInstance.throwError(
                        `${
                            existingEmail.email == email ? email : username
                        } đã tồn tại`,
                        400
                    );
                }
            } else {
                if (action != "sign-up") {
                    responseMessageInstance.throwError("Email not found!", 404);
                }
            }
            console.log(existingEmail);
            const otp = Array.from({ length: OTP_LENGTH }, () =>
                Math.floor(Math.random() * 10)
            ).join("");
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            const mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: "Xác thực email",
                html: `Thân gửi ${email}, <br/>
                Mã xác minh của bạn là: ${otp} <br/>
                Mã xác minh này chỉ có hiệu lực trong vòng 15 phút tiếp theo và chỉ dành riêng cho việc đăng nhập vào tài khoản của bạn.<br/>
                Hướng dẫn:<br/>
                    1. Nhập mã này vào trang yêu cầu xác thực trên ứng dụng hoặc website của chúng tôi.<br/>
                    2. Không chia sẻ mã xác minh này với người khác.<br/><br/>

                Nếu bạn không yêu cầu mã xác minh, hoặc có thắc mắc, vui lòng liên hệ ngay với bộ phận hỗ trợ khách hàng của chúng tôi.<br/><br/>

                Trân trọng,<br/>
                Introducing Tutor<br/>
                ${process.env.EMAIL_ADDRESS}`,
            };
            // transporter.sendMail(mailOptions, (error) => {
            //     if (error) {
            //         responseMessageInstance.throwError(
            //             `There was an error while sending the email. ${error}`,
            //             500
            //         );
            //     }
            // });

            await Otp.create({
                code: otp,
                email: email,
            });

            setTimeout(async () => {
                await Otp.destroy({ where: { code: otp } });
            }, 15 * 60 * 1000);
            return responseMessageInstance.getSuccess(res, 200, "OK!", {
                data: {
                    otp,
                },
            });
        } catch (error) {
            console.log(error.message);
            return responseMessageInstance.getError(
                res,
                error.code ?? 500,
                error.message
            );
        }
    }
    async SignUp(req, res) {
        try {
            const registeredUserInfo = req.body.data ?? {};
            const verify = req.body.verify ?? "";

            if (
                !verify ||
                !CredentialsValidation("otp", verify.otpCode) ||
                !CredentialsValidation("email", verify.email)
            ) {
                responseMessageInstance.throwError("Invalid Verify info", 400);
            }
            // const checkOTP = await Otp.findOne({
            //     where: { code: verify.otpCode, email: verify.email },
            // });
            // if (!checkOTP) {
            //     responseMessageInstance.throwError(
            //         "Incorrect verification code.",
            //         400
            //     );
            // }
            if (!registeredUserInfo) {
                responseMessageInstance.throwError("Invalid User Info", 400);
            }
            const invalidAttributes = findInvalidOrEmptyAttributes(
                registeredUserInfo,
                User
            );
            if (invalidAttributes.length != 0) {
                responseMessageInstance.throwError(
                    `Invalid Attribute: ${invalidAttributes}`,
                    400
                );
            }

            const invalidFields = [
                "username",
                "password",
                "name",
                "email",
                "phoneNumber",
                "age",
                "role",
            ].filter(
                (field) =>
                    !CredentialsValidation(field, registeredUserInfo[field])
            );

            if (invalidFields.length > 0) {
                responseMessageInstance.throwError(
                    `Invalid User info: ${invalidFields}`,
                    400
                );
            }
            registeredUserInfo.password = await bcrypt.hash(
                registeredUserInfo.password,
                10
            );

            const educationLevel = registeredUserInfo.educationLevel;
            if (registeredUserInfo.role == ROLE.tutor) {
                if (
                    !educationLevel ||
                    !educationLevel.education ||
                    !educationLevel.experience
                ) {
                    responseMessageInstance.throwError(
                        "Invalid educationLevel",
                        400
                    );
                }
            } else {
                if (
                    !educationLevel ||
                    !educationLevel.gradeLevel ||
                    educationLevel.gradeLevel < MIN_GRADEL_LEVEL ||
                    educationLevel.gradeLevel > MAX_GRADEL_LEVEL
                ) {
                    console.log(educationLevel);
                    responseMessageInstance.throwError(
                        "Invalid educationLevel",
                        400
                    );
                }
            }

            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        { username: registeredUserInfo.username },
                        { email: registeredUserInfo.email },
                        { phoneNumber: registeredUserInfo.phoneNumber },
                    ],
                },
            });

            if (existingUser) {
                if (existingUser.username == registeredUserInfo.username) {
                    responseMessageInstance.throwError(
                        "Username already exists",
                        400
                    );
                }
                if (existingUser.email == registeredUserInfo.email) {
                    responseMessageInstance.throwError(
                        "Email already exists",
                        400
                    );
                }
                if (
                    existingUser.phoneNumber == registeredUserInfo.phoneNumber
                ) {
                    responseMessageInstance.throwError(
                        "Phone Number already exists",
                        400
                    );
                }
            }

            const newUser = await User.create(registeredUserInfo);

            if (registeredUserInfo.role == ROLE.tutor) {
                await Tutor.create({
                    userId: newUser.id,
                    education: educationLevel.education,
                    experience: educationLevel.experience,
                });
            } else {
                await Student.create({
                    userId: newUser.id,
                    gradeLevel: educationLevel.gradeLevel,
                });
            }

            return responseMessageInstance.getSuccess(
                res,
                200,
                "Register Succesful!"
            );
        } catch (error) {
            console.log(error.message);
            return responseMessageInstance.getError(
                res,
                error.code ?? 500,
                error.message
            );
        }
    }
    async ChangePassword(req, res) {
        try {
            const accessKey = req.headers["authorization"] ?? "";
            const { oldPassword, password, retypePassword } =
                req.body.data ?? {};

            const verify = req.body.verify ?? "";

            if (!accessKey) {
                responseMessageInstance.throwError("Invalid accessKey", 400);
            }

            const decodedToken = jwt.verify(
                accessKey.split(" ")[1],
                process.env.SECRET_KEY
            );
            const userId = decodedToken.userId;

            if (
                !verify ||
                !CredentialsValidation("otp", verify.otpCode) ||
                !CredentialsValidation("email", verify.email)
            ) {
                responseMessageInstance.throwError("Invalid Verify info", 400);
            }
            const checkOTP = await Otp.findOne({
                where: { code: verify.otpCode, email: verify.email },
            });
            if (!checkOTP) {
                responseMessageInstance.throwError(
                    "Incorrect verification code.",
                    400
                );
            }
            if (!oldPassword || !password || !retypePassword) {
                responseMessageInstance.throwError(
                    "Please provide old password, new password, and retype password",
                    400
                );
            }
            if (
                !CredentialsValidation("password", oldPassword) ||
                !CredentialsValidation("password", password) ||
                !CredentialsValidation("password", retypePassword)
            ) {
                responseMessageInstance(
                    "Ivalid password, new password or retype password",
                    400
                );
            }
            if (password !== retypePassword) {
                responseMessageInstance.throwError(
                    "Password and confirm password do not match",
                    400
                );
            }
            const user = await User.findByPk(userId);
            if (!user) {
                responseMessageInstance.throwError("User not found!", 404);
            }

            const storedPassword = user.password;
            const checkpassword = await bcrypt.compare(
                oldPassword,
                storedPassword
            );
            if (!checkpassword) {
                responseMessageInstance.throwError(
                    "Old password is incorrect",
                    400
                );
            }

            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    responseMessageInstance.throwError(
                        "Internal Server Errors",
                        500
                    );
                }
                await User.update(
                    { password: hash },
                    {
                        where: {
                            id: userId,
                        },
                    }
                );
                return responseMessageInstance.getSuccess(
                    res,
                    200,
                    "Password changed successfully"
                );
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
    async ForgotPassword(req, res) {
        try {
            const { username, newPassword, retypePassword } =
                req.body.data ?? {};
            const verify = req.body.verify ?? {};

            if (
                !verify ||
                !CredentialsValidation("otp", verify.otpCode) ||
                !CredentialsValidation("email", verify.email)
            ) {
                responseMessageInstance.throwError("Invalid Verify info", 400);
            }
            const checkOTP = await Otp.findOne({
                where: { code: verify.otpCode, email: verify.email },
            });
            if (!checkOTP) {
                responseMessageInstance.throwError(
                    "Incorrect verification code.",
                    400
                );
            }
            if (
                !username ||
                !newPassword ||
                !retypePassword ||
                !CredentialsValidation("username", username) ||
                !CredentialsValidation("password", newPassword) ||
                !CredentialsValidation("password", retypePassword)
            ) {
                responseMessageInstance.throwError(
                    "Invalid User Credential",
                    400
                );
            }
            if (newPassword != retypePassword) {
                responseMessageInstance.throwError(
                    "New password does not match Retype password.",
                    400
                );
            }
            const user = await User.findOne({ where: { username: username } });
            if (!user) {
                responseMessageInstance.throwError("User not found!", 404);
            }
            bcrypt.hash(newPassword, 10, async (err, hash) => {
                if (err) {
                    responseMessageInstance.throwError(
                        "Internal Server Errors",
                        500
                    );
                }
                await User.update(
                    { password: hash },
                    {
                        where: {
                            username: username,
                        },
                    }
                );
                return responseMessageInstance.getSuccess(
                    res,
                    200,
                    "Reset password successfully"
                );
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
    async GetProfile(req, res) {
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
            const user = await User.findByPk(userId, {
                raw: true,
            });
            if (!user) {
                responseMessageInstance.throwError("User not found!", 404);
            }
            if (user.role == ROLE.tutor) {
                user.educationLevel = await Tutor.findOne({
                    attributes: ["education", "experience"],
                    where: { userId: user.id },
                });
            } else {
                user.educationLevel = await Student.findOne({
                    attributes: ["gradeLevel"],
                    where: { userId: user.id },
                });
            }
            return responseMessageInstance.getSuccess(
                res,
                200,
                "Get profile successfull",
                {
                    profile: {
                        name: user.name,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        age: user.age,
                        educationLevel: user.educationLevel,
                    },
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
    async DumpData(req, res) {
        try {
            for (let i = 1; i <= 1000; i++) {
                const password = await bcrypt.hash("password" + i, 10);
                let phoneNumber = "0";
                for (let i = 0; i < 9; i++) {
                    const digit = Math.floor(Math.random() * 10);
                    phoneNumber += digit;
                }
                const userData = {
                    name: `User${i}`,
                    email: `user${i}@example.com`,
                    phone_number: phoneNumber,
                    age: Math.floor(Math.random() * 60) + 5,
                    username: `user${i}`,
                    password: password,
                    role: Math.floor(Math.random() * 2) + 1,
                    status: role == 2 ? 1 : 2,
                };

                await User.create(userData);
            }
            return responseMessageInstance.getSuccess(res, 200, "Succesful");
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

export const userServiceInstance = UserService.getInstance();
