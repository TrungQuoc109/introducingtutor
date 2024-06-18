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
            return !isNaN(value) && parseInt(Number(value)) == value;
        }
        case "role": {
            return value == ROLE.tutor || value == ROLE.student;
        }
        case "otp": {
            return OTP_FORMAT.test(value);
        }
        case "count": {
            const count = parseInt(value, 10);
            return count > 0 && count < 31 && Number.isInteger(count);
        }
        case "gradelLevel": {
            return value > 0 && value < 13;
        }
        case "date": {
            const date = new Date(value);
            const now = new Date();
            const after30Day = new Date();
            now.setDate(now.getDate() + 3);
            after30Day.setMonth(now.getMonth() + 1);
            //   console.log(after30Day, now);
            return (
                date instanceof Date &&
                !isNaN(date) &&
                date.setHours(0, 0, 0, 0) > now.setHours(0, 0, 0, 0) &&
                date.setHours(0, 0, 0, 0) <= after30Day.setHours(0, 0, 0, 0)
            );
        }
        case "price": {
            const amount = parseFloat(value);
            return amount > 0 && !isNaN(amount);
        }
    }
}
export const districts = [
    {
        id: "760",
        name: "Quận 1",
    },
    {
        id: "770",
        name: "Quận 3",
    },
    {
        id: "773",
        name: "Quận 4",
    },
    {
        id: "774",
        name: "Quận 5",
    },
    {
        id: "775",
        name: "Quận 6",
    },
    {
        id: "778",
        name: "Quận 7",
    },
    {
        id: "776",
        name: "Quận 8",
    },

    {
        id: "771",
        name: "Quận 10",
    },
    {
        id: "772",
        name: "Quận 11",
    },
    {
        id: "761",
        name: "Quận 12",
    },

    {
        id: "777",
        name: "Quận Bình Tân",
    },
    {
        id: "765",
        name: "Quận Bình Thạnh",
    },
    {
        id: "764",
        name: "Quận Gò Vấp",
    },
    {
        id: "768",
        name: "Quận Phú Nhuận",
    },
    {
        id: "766",
        name: "Quận Tân Bình",
    },
    {
        id: "767",
        name: "Quận Tân Phú",
    },
    {
        id: "769",
        name: "Thành phố Thủ Đức",
    },
    {
        id: "785",
        name: "Huyện Bình Chánh",
    },
    {
        id: "787",
        name: "Huyện Cần Giờ",
    },
    {
        id: "783",
        name: "Huyện Củ Chi",
    },
    {
        id: "784",
        name: "Huyện Hóc Môn",
    },
    {
        id: "786",
        name: "Huyện Nhà Bè",
    },
];
