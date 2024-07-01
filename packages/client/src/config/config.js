export const firebaseConfig = {
    apiKey: "AIzaSyA1z-09ff7--QW4OH3f3d_bkXunw0ZTVpM",
    authDomain: "introducing-tutor.firebaseapp.com",
    projectId: "introducing-tutor",
    storageBucket: "introducing-tutor.appspot.com",
    messagingSenderId: "1051596096960",
    appId: "1:1051596096960:web:58db92d5c78a3981b53425",
    measurementId: "G-Q8GKPLWELC",
};
export const baseURL = "http://localhost:5999/v1/api";
export const statusCourse = [
    "Vô hiệu hóa",
    "Mở đăng ký",
    "Đóng đăng ký",
    "Kết thúc",
];
export const paymentStatus = [
    "Đăng ký thành công",
    "Chờ thanh toán",
    "Huỷ đăng ký",
];
export const userStatus = ["Vô hiệu hoá", "Đang hoạt động"];
export const userRole = ["", "Gia sư", "Học sinh"];
export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month =
        date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1; // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}
export const getDayOfWeekLabel = (dayOfWeek) => {
    const days = {
        2: "Thứ Hai",
        3: "Thứ Ba",
        4: "Thứ Tư",
        5: "Thứ Năm",
        6: "Thứ Sáu",
        7: "Thứ Bảy",
        8: "Chủ nhật",
    };
    return days[dayOfWeek];
};
export const districts = [
    {
        id: 760,
        name: "Quận 1",
    },
    {
        id: 770,
        name: "Quận 3",
    },
    {
        id: 773,
        name: "Quận 4",
    },
    {
        id: 774,
        name: "Quận 5",
    },
    {
        id: 775,
        name: "Quận 6",
    },
    {
        id: 778,
        name: "Quận 7",
    },
    {
        id: 776,
        name: "Quận 8",
    },

    {
        id: 771,
        name: "Quận 10",
    },
    {
        id: 772,
        name: "Quận 11",
    },
    {
        id: 761,
        name: "Quận 12",
    },

    {
        id: 777,
        name: "Quận Bình Tân",
    },
    {
        id: 765,
        name: "Quận Bình Thạnh",
    },
    {
        id: 764,
        name: "Quận Gò Vấp",
    },
    {
        id: 768,
        name: "Quận Phú Nhuận",
    },
    {
        id: 766,
        name: "Quận Tân Bình",
    },
    {
        id: 767,
        name: "Quận Tân Phú",
    },
    {
        id: 769,
        name: "Thành phố Thủ Đức",
    },
    {
        id: 785,
        name: "Huyện Bình Chánh",
    },
    {
        id: 787,
        name: "Huyện Cần Giờ",
    },
    {
        id: 783,
        name: "Huyện Củ Chi",
    },
    {
        id: 784,
        name: "Huyện Hóc Môn",
    },
    {
        id: 786,
        name: "Huyện Nhà Bè",
    },
];
