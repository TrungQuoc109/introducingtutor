export function findInvalidOrEmptyAttributes(object, model) {
    const userAttributes = Object.keys(model.rawAttributes);
    const invalidOrEmptyAttributes = [];

    for (const [key, value] of Object.entries(object)) {
        if (key == "educationLevel" || key == "subjects" || key == "address") {
            continue;
        }
        console.log(value);
        if (!userAttributes.includes(key) || !value) {
            invalidOrEmptyAttributes.push(key);
        }
    }

    return invalidOrEmptyAttributes;
}
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
export function calculateEndDate(startDateStr, totalSessions, sessionsPerWeek) {
    // Chuyển đổi chuỗi ngày bắt đầu sang đối tượng Date
    const startDate = new Date(startDateStr);

    // Tính tổng số tuần cần thiết
    const totalWeeks = totalSessions / sessionsPerWeek;

    // Tính tổng số ngày cần thiết
    const totalDays = totalWeeks * 7;

    // Tính ngày kết thúc
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + totalDays);

    // Định dạng ngày kết thúc sang chuỗi 'YYYY-MM-DD'
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, "0");
    const day = String(endDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
