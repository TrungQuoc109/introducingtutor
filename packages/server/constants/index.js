export const DATE_FORMAT = "DD-MM-YYYY";
export const TIMEZONE = "Asia/Ho_Chi_Minh";
export const MIN_GRADEL_LEVEL = 1;
export const MAX_GRADEL_LEVEL = 12;
export const OTP_LENGTH = 6;
export const ROLE = {
    admin: 0,
    tutor: 1,
    student: 2,
};
export const STATUS = {
    deactive: 0,
    active: 1,
};
const OTP_FORMAT = /^\d{6}$/;

const USERNAME_FORMAT = /^[a-zA-Z0-9_]{4,30}$/;
const PASSWORD_FORMAT =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-`~!@#$%^&*()_+={}[\\]|\:\;\"\'\<\>\,\.?\/]).{8,30}$/;

const NAME_FORMAT = /^[\p{L} .]{4,30}$/u;

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]{2,30}$/;
const PHONE_FORMAT = /^(0[1-9][0-9]{8}|\+84[1-9][0-9]{8})$/;

export function CredentialsValidation(type, value) {
    switch (type) {
        case "name": {
            return NAME_FORMAT.test(value);
        }
        case "email": {
            return EMAIL_FORMAT.test(value);
        }
        case "password": {
            return PASSWORD_FORMAT.test(value);
        }
        case "username": {
            return USERNAME_FORMAT.test(value);
        }
        case "phoneNumber": {
            return PHONE_FORMAT.test(value);
        }
        case "age": {
            return !isNaN(value) && parseInt(Number(value)) === value;
        }
        case "role": {
            return value == ROLE.tutor || value == ROLE.student;
        }
        case "otp": {
            return OTP_FORMAT.test(value);
        }
        case "count": {
            const count = parseInt(value, 10);
            return count > 0 && Number.isInteger(count);
        }
        case "gradelLevel": {
            return value > 0 && value < 13;
        }
        case "date": {
            const date = new Date(value);
            const now = new Date();
            now.setDate(now.getDate() + 3);

            return (
                date instanceof Date &&
                !isNaN(date) &&
                date.setHours(0, 0, 0, 0) > now.setHours(0, 0, 0, 0)
            );
        }
        case "price": {
            const amount = parseFloat(value);
            return amount > 0 && !isNaN(amount);
        }
    }
}
