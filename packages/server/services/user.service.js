import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { responseMessageInstance } from "../utils/index.js";
import {
    COURSE_STATUS,
    CredentialsValidation,
    MAX_GRADEL_LEVEL,
    MIN_GRADEL_LEVEL,
    OTP_LENGTH,
    ROLE,
    districts,
} from "../constants/index.js";
import {
    Lesson,
    Location,
    Otp,
    Student,
    StudentTeachingSubjectMap,
    Subject,
    TeachingSubject,
    Tutor,
    TutorSubjectMap,
    User,
} from "../model/index.js";
import {
    calculateEndDate,
    findInvalidOrEmptyAttributes,
} from "../utils/validate.js";
import { Op, where } from "sequelize";
import nodemailer from "nodemailer";
import { sequelize } from "../datasourse/db.connection.js";

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
            const { action, username, phoneNumber, email } = req.body ?? {};

            const isValidEmail = CredentialsValidation("email", email);
            if (!isValidEmail) {
                responseMessageInstance.throwError("Invalid email.");
            }

            let whereCondition = {
                [Op.or]: [],
            };

            if (username) {
                whereCondition[Op.or].push({ username: username });
            }

            if (phoneNumber) {
                whereCondition[Op.or].push({ phoneNumber: phoneNumber });
            }

            // Thực hiện truy vấn với điều kiện đã tạo
            const existingInfo = await User.findAll({
                attributes: ["phoneNumber", "email", "username"],
                where: whereCondition,
                raw: true,
            });
            var existingInfoAttributes = {};
            if (existingInfo) {
                if (action == "sign-up") {
                    existingInfo.map((item) => {
                        Object.keys(item).forEach((element) => {
                            console.log(element);
                            if (
                                item[element] == email ||
                                item[element] == phoneNumber ||
                                item[element] == username
                            ) {
                                if (!existingInfoAttributes[element])
                                    existingInfoAttributes[element] =
                                        item[element];
                            }
                        });
                    });
                    if (Object.keys(existingInfoAttributes).length != 0) {
                        responseMessageInstance.throwError(
                            `${Object.keys(existingInfoAttributes).join(
                                ", "
                            )} đã tồn tại`,
                            400
                        );
                    }
                }
            } else {
                if (action != "sign-up") {
                    responseMessageInstance.throwError("Email not found!", 404);
                }
            }
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
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    responseMessageInstance.throwError(
                        `There was an error while sending the email. ${error}`,
                        500
                    );
                }
            });

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
                !registeredUserInfo ||
                (typeof registeredUserInfo === "object" &&
                    Object.keys(registeredUserInfo).length === 0)
            ) {
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
                    responseMessageInstance.throwError(
                        "Invalid educationLevel",
                        400
                    );
                }
            }
            registeredUserInfo.address.forEach((district) => {
                const isValid = districts.some(
                    (item) =>
                        item.id == district.id && item.name == district.name
                );
                if (!isValid) {
                    responseMessageInstance.throwError(
                        `District not found: ${district.name}`
                    );
                }
            });
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
                const tutor = await Tutor.create({
                    userId: newUser.id,
                    education: educationLevel.education,
                    experience: educationLevel.experience,
                });
                for (const item of registeredUserInfo.subjects) {
                    await TutorSubjectMap.create({
                        tutorId: tutor.id,
                        subjectId: item.id,
                    });
                }
                for (const item of registeredUserInfo.address) {
                    await Location.create({
                        tutorId: tutor.id,
                        districtsId: item.id,
                        name: item.name,
                    });
                }
            } else {
                await Student.create({
                    userId: newUser.id,
                    gradeLevel: educationLevel.gradeLevel,
                });
            }

            return responseMessageInstance.getSuccess(
                res,
                200,
                "Register Succesful!",
                { data: { userId: newUser.id } }
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
            if (!oldPassword || !password || !retypePassword) {
                responseMessageInstance.throwError(
                    "Please provide old password, new password, and retype password",
                    400
                );
            }
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

            const checkpassword = await bcrypt.compare(
                oldPassword,
                user.password
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
                attributes: [
                    "id",
                    "name",
                    "email",
                    "phoneNumber",
                    "age",
                    "role",
                ],
                include: [
                    {
                        model: Tutor,
                        attributes: ["education", "experience", "id"],

                        required: false,
                    },
                    {
                        model: Student,
                        attributes: ["gradeLevel"],
                        required: false,
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!user) {
                responseMessageInstance.throwError("User not found!", 404);
            }
            if (user.role == ROLE.tutor) {
                delete user.Student;
            } else if (user.role == ROLE.student) {
                delete user.Tutor;
            } else {
                delete user.Student;
                delete user.Tutor;
            }
            let subjects, address;
            if (user.role == ROLE.tutor) {
                subjects = await Subject.findAll({
                    attributes: ["id", "name"],
                    include: {
                        model: TutorSubjectMap,
                        attributes: [],
                        where: { tutorId: user.Tutor.id },
                    },
                });

                address = await Location.findAll({
                    attributes: ["districtsId", "name"],
                    where: { tutorId: user.Tutor.id },
                    order: [["districtsId", "asc"]],
                });
            }

            return responseMessageInstance.getSuccess(
                res,
                200,
                "Get profile successfull",
                {
                    data: { user, subjects, address },
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
    async ChangeProfile(req, res) {
        try {
            const userInfo = req.body.data ?? {};
            const accessKey = req.headers["authorization"] ?? "";
            const verify = req.body.verify ?? "";
            console.log(userInfo, verify);
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
            if (
                !userInfo ||
                (typeof userInfo === "object" &&
                    Object.keys(userInfo).length === 0)
            ) {
                responseMessageInstance.throwError("Invalid User Info", 400);
            }

            const invalidFields = [
                "name",
                "email",
                "phoneNumber",
                "age",
            ].filter(
                (field) =>
                    userInfo[field] != null &&
                    !CredentialsValidation(field, userInfo[field])
            );

            if (invalidFields.length > 0) {
                responseMessageInstance.throwError(
                    `Invalid User info: ${invalidFields}`,
                    400
                );
            }

            var educationLevel = userInfo.Tutor;
            if (userInfo.role == ROLE.tutor) {
                educationLevel = userInfo.Tutor;
                if (
                    educationLevel &&
                    (!educationLevel.education || !educationLevel.experience)
                ) {
                    responseMessageInstance.throwError(
                        "Invalid educationLevel",
                        400
                    );
                }
            } else {
                educationLevel = userInfo.Student;
                if (
                    educationLevel &&
                    (!educationLevel.gradeLevel ||
                        educationLevel.gradeLevel < MIN_GRADEL_LEVEL ||
                        educationLevel.gradeLevel > MAX_GRADEL_LEVEL)
                ) {
                    responseMessageInstance.throwError(
                        "Invalid educationLevel",
                        400
                    );
                }
            }
            const user = await User.findByPk(userId, {
                include: [
                    {
                        model: Student,
                    },
                    {
                        model: Tutor,
                    },
                ],
            });

            if (!user) {
                responseMessageInstance.throwError("User not found! ", 404);
            }
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        { email: userInfo.email ?? "" },
                        { phoneNumber: userInfo.phoneNumber ?? "" },
                    ],
                    id: {
                        [Op.ne]: userId,
                    },
                },
            });

            if (existingUser) {
                if (existingUser.email == userInfo.email) {
                    responseMessageInstance.throwError(
                        "Email already exists",
                        400
                    );
                }
                if (existingUser.phoneNumber == userInfo.phoneNumber) {
                    responseMessageInstance.throwError(
                        "Phone Number already exists",
                        400
                    );
                }
            }

            var hasChanges = false;
            for (const key in userInfo) {
                if (
                    key !== "Student" &&
                    key !== "Tutor" &&
                    user[key] !== userInfo[key]
                ) {
                    user[key] = userInfo[key];
                    hasChanges = true;
                }
            }

            if (user.role == ROLE.student && user.Student != null) {
                if (user.Student.gradeLevel !== userInfo.Student.gradeLevel) {
                    user.Student.gradeLevel = userInfo.Student.gradeLevel;
                    hasChanges = true;
                }
            }

            if (user.role == ROLE.tutor && user.Tutor != null) {
                if (
                    user.Tutor.education != userInfo.Tutor.education ||
                    user.Tutor.experience != userInfo.Tutor.experience
                ) {
                    user.Tutor.education = userInfo.Tutor.education;
                    user.Tutor.experience = userInfo.Tutor.experience;
                    hasChanges = true;
                }
            }

            if (hasChanges) {
                await user.save();
                if (user.Student) {
                    await user.Student.save();
                }
                if (user.Tutor) {
                    console.log(1);
                    await user.Tutor.save();
                }
                return responseMessageInstance.getSuccess(
                    res,
                    200,
                    "Profile updated successfully"
                );
            } else {
                responseMessageInstance.throwError(
                    "No changes detected, update skipped",
                    304
                );
            }
        } catch (error) {
            console.log(error.message);
            return responseMessageInstance.getError(
                res,
                error.code ?? 500,
                error.message
            );
        }
    }
    async GetSubject(req, res) {
        try {
            const subjects = await Subject.findAll();
            if (!subjects) {
                responseMessageInstance.throwError("Subject not found!", 404);
            }
            return responseMessageInstance.getSuccess(res, 200, "Succesful", {
                data: subjects,
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
    async GetTeachingSubjects(req, res) {
        try {
            const { page = 0 } = req.params || {};
            const limit = 10;
            const { count, rows: teachingSubjects } =
                await TeachingSubject.findAndCountAll({
                    attributes: [
                        "id",
                        "name",

                        "description",
                        "gradeLevel",
                        "startDate",
                        "numberOfSessions",
                        "location",
                        "price",
                        "studentCount",
                        "status",
                        "specificAddress",
                    ],
                    include: [
                        {
                            model: Tutor,
                            attributes: ["id"],
                            include: [
                                {
                                    model: User,
                                    attributes: ["name"],
                                },
                            ],
                        },
                        {
                            model: Subject,
                            attributes: ["id", "name"],
                        },
                    ],
                    where: {
                        status: {
                            [Op.and]: [
                                { [Op.ne]: COURSE_STATUS.disabledCourse },
                                { [Op.ne]: COURSE_STATUS.completedCourse },
                            ],
                        },
                        startDate: { [Op.gte]: new Date() },
                    },
                    order: [["status", "asc"]],
                    limit: limit,
                    offset: page * limit,
                });

            if (!teachingSubjects) {
                responseMessageInstance.throwError("Subject not found!", 404);
            }
            return responseMessageInstance.getSuccess(res, 200, "Succesful", {
                data: { teachingSubjects, page: Math.ceil(count / limit) },
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
    async GetTutors(req, res) {
        try {
            const { page = 0 } = req.params || {};
            const limit = 8;

            const tutors = await Tutor.findAll({
                attributes: ["id", "education", "experience"],
                include: [
                    {
                        model: User,
                        attributes: ["name", "email", "phoneNumber", "id"],
                    },
                    {
                        model: TutorSubjectMap,

                        attributes: ["id"],
                        include: [{ model: Subject }],
                    },
                ],
                limit: limit,
                offset: page * limit,
            });
            const count = await Tutor.count();
            if (!tutors) {
                responseMessageInstance.throwError("Tutors not found!", 404);
            }

            return responseMessageInstance.getSuccess(res, 200, "Succesful", {
                data: { tutors, page: Math.ceil(count / limit) },
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
    async GetMyCourses(req, res) {
        try {
            const { page = 0 } = req.params || {};
            const limit = 10;
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
            const userRole = decodedToken.role;
            let queryOptions = {
                attributes: [
                    "id",
                    "name",
                    "subjectId",
                    "gradeLevel",
                    "startDate",
                    "numberOfSessions",
                    "location",
                    "price",
                    "description",
                    "specificAddress",
                ],
                include: [
                    {
                        model: Tutor,
                        attributes: ["id", "userId"],
                        include: [{ model: User, attributes: ["name"] }],
                    },
                    { model: Subject, attributes: ["name"] },
                ],
                order: [["status", "asc"]],
                limit: limit,
                offset: page * limit,
            };

            if (userRole == 2) {
                queryOptions.include.push({
                    model: StudentTeachingSubjectMap,
                    attributes: ["id", "status", "orderId"],
                    include: [
                        {
                            model: Student,
                            attributes: [],
                            where: { userId: userId },
                        },
                    ],
                });
            } else if (userRole == 1) {
                queryOptions.attributes.push("studentCount", "status");

                const tutorInclude = queryOptions.include.find(
                    (inc) => inc.model === Tutor
                );

                if (tutorInclude) {
                    if (!tutorInclude.where) tutorInclude.where = {};

                    tutorInclude.where.userId = userId;
                }
            }

            const { count, rows: courses } =
                await TeachingSubject.findAndCountAll(queryOptions);

            return responseMessageInstance.getSuccess(res, 200, "Succesful", {
                data: { courses, page: Math.ceil(count / limit) },
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
    async SearchTutor(req, res) {
        try {
            const limit = 8;
            const { page = 0, subjectId, location, searchTerm } = req.query;
            let countOptions = {
                where: {},
            };

            if (subjectId) {
                countOptions.include = [
                    {
                        model: TutorSubjectMap,
                        where: { subjectId: subjectId },
                    },
                ];
            }

            if (location) {
                countOptions.include = [
                    {
                        model: Location,
                        where: { districtsId: location },
                    },
                ];
            }

            if (searchTerm) {
                countOptions.include = [
                    {
                        model: User,
                        where: {
                            name: {
                                [Op.iLike]: `%${searchTerm}%`,
                            },
                        },
                    },
                ];
            }

            const count = await Tutor.count(countOptions);

            let option = {
                attributes: ["id", "education", "experience"],
                include: [
                    {
                        model: User,
                        attributes: ["name", "email", "phoneNumber", "id"],
                    },
                    {
                        model: TutorSubjectMap,
                        attributes: ["id"],
                        include: [{ model: Subject }],
                    },
                    { model: Location, attributes: ["name", "districtsId"] },
                ],

                limit: limit,
                offset: page * limit,
            };

            if (subjectId) {
                option.include.push({
                    model: TutorSubjectMap,
                    where: { subjectId: subjectId },
                    include: [{ model: Subject }],
                });
            }

            if (location) {
                option.include[2].where = {};
                option.include[2].where.districtsId = location;
            }

            if (searchTerm) {
                option.include[0].where = {
                    name: {
                        [Op.iLike]: `%${searchTerm}%`,
                    },
                };
            }

            const tutors = await Tutor.findAll(option);
            console.log(count);
            return responseMessageInstance.getSuccess(res, 200, "Succesful", {
                data: { tutors, page: Math.ceil(count / limit) },
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
    async GetTutorDetail(req, res) {
        try {
            const tutorId = req.params.tutorId ?? "";

            const tutor = await Tutor.findByPk(tutorId, {
                attributes: ["education", "experience", "id"],
                include: [
                    {
                        model: TutorSubjectMap,
                        attributes: ["id"],
                        include: [
                            { model: Subject, attributes: ["id", "name"] },
                        ],
                    },
                    {
                        model: Location,
                        attributes: ["districtsId", "name"],
                        order: [["districtsId", "asc"]],
                    },
                    { model: User, attributes: ["id", "name", "age"] },
                    {
                        model: TeachingSubject,
                        attributes: [
                            "id",
                            "name",
                            "description",
                            "gradeLevel",
                            "startDate",
                            "numberOfSessions",
                            "location",
                            "price",
                            "studentCount",
                            "status",
                        ],
                        include: [
                            { model: Subject, attributes: ["id", "name"] },
                        ],
                        order: [["status", "asc"]],
                    },
                ],
            });

            if (tutor.length == 0) {
                responseMessageInstance.throwError("Tutor not found!", 404);
            }

            return responseMessageInstance.getSuccess(res, 200, "Succesful", {
                data: { tutor },
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
    async GetCourseDetail(req, res) {
        try {
            const courseId = req.params.courseId ?? "";
            const course = await TeachingSubject.findByPk(courseId, {
                attributes: [
                    "id",
                    "description",
                    "gradeLevel",
                    "name",
                    "numberOfSessions",
                    "studentCount",
                    "price",
                    "startDate",
                    "specificAddress",
                    "location",
                    "status",
                ],
                include: [
                    { model: Subject, attributes: ["id", "name"] },
                    {
                        model: Tutor,
                        attributes: ["userId"],
                        include: [{ model: User, attributes: ["name"] }],
                    },
                    {
                        model: Lesson,
                        attributes: [
                            "id",
                            "dayOfWeek",
                            "startTime",
                            "duration",
                        ],
                    },
                ],
            });

            const registeredStudents = await StudentTeachingSubjectMap.count({
                where: { teachingSubjectId: courseId },
            });
            if (course.length == 0) {
                responseMessageInstance.throwError(
                    "Không tìm thấy khóa học!",
                    404
                );
            }
            //  course.registeredStudents = registeredStudents;
            const endDate = calculateEndDate(
                course.startDate,
                course.numberOfSessions,
                course.Lessons.length == 0 ? 1 : course.Lessons.length
            );

            // Gán giá trị cho endDate bằng setDataValue
            course.setDataValue("endDate", endDate);

            return responseMessageInstance.getSuccess(res, 200, "Succesful", {
                data: { course, registeredStudents },
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
    async SearchCourse(req, res) {
        try {
            const limit = 8;
            const { page = 0, subjectId, location, searchTerm } = req.query;

            let countOptions = {
                where: {
                    status: {
                        [Op.and]: [
                            { [Op.ne]: COURSE_STATUS.disabledCourse },
                            { [Op.ne]: COURSE_STATUS.completedCourse },
                        ],
                    },
                },
            };

            if (location) {
                countOptions.where.location = location;
            }

            if (searchTerm) {
                countOptions.where = {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${searchTerm}%` } },
                        { description: { [Op.iLike]: `%${searchTerm}%` } },
                    ],
                };
            }
            if (subjectId) {
                countOptions.where.subjectId = subjectId;
            }

            const count = await TeachingSubject.count(countOptions);

            let option = {
                attributes: [
                    "id",
                    "name",
                    "description",
                    "gradeLevel",
                    "startDate",
                    "numberOfSessions",
                    "specificAddress",
                    "location",
                    "price",
                    "studentCount",
                    "status",
                ],
                include: [
                    {
                        model: Tutor,
                        attributes: ["id"],
                        include: [
                            {
                                model: User,
                                attributes: ["name"],
                            },
                        ],
                    },
                    { model: Subject },
                ],
                where: {
                    status: {
                        [Op.and]: [
                            { [Op.ne]: COURSE_STATUS.disabledCourse },
                            { [Op.ne]: COURSE_STATUS.completedCourse },
                        ],
                    },
                },
                limit: limit,
                offset: page * limit,
            };

            if (subjectId) {
                option.where.subjectId = subjectId;
            }

            // Thêm điều kiện location nếu có
            if (location) {
                option.where.location = location;
            }

            // Thêm điều kiện tìm kiếm theo tên hoặc mô tả nếu có
            if (searchTerm) {
                option.where = {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${searchTerm}%` } },
                        { description: { [Op.iLike]: `%${searchTerm}%` } },
                    ],
                };
            }
            const courses = await TeachingSubject.findAll(option);

            return responseMessageInstance.getSuccess(res, 200, "Succesful", {
                data: { courses, page: Math.ceil(count / limit) },
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
}

export const userServiceInstance = UserService.getInstance();
