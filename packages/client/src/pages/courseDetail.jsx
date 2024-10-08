import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Container,
    CssBaseline,
    Grid,
    Typography,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { DataContext } from "../dataprovider/subject";
import {
    baseURL,
    districts,
    formatDate,
    getDayOfWeekLabel,
} from "../config/config";
import Header from "../components/header";
import Footer from "../components/footer";
import RegisterButton from "../components/registerButton";
// Mock data, replace this with your data fetching logic

export default function CourseDetail() {
    const [formLesson, setFormLesson] = useState({
        dayOfWeek: "",
        startTime: "",
        duration: "",
    });
    const [courseDetail, setCourseDetail] = useState(null);
    const [registeredStudents, setRegisteredStudents] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const currentDate = new Date();
    const [courseStartDate, setCourseStartDate] = useState(null);
    const location = useLocation();
    const fromPage = location.state?.fromPage;
    const { courseId } = useParams();
    const dayOfWeek = [2, 3, 4, 5, 6, 7, 8];
    const duration = [90, 120, 150, 180];
    const username = sessionStorage.getItem("username");
    const token = localStorage.getItem(username);
    const role = localStorage.getItem(username + "_role");
    const fetchData = async () => {
        try {
            const response = await fetch(
                `${baseURL}/user/get-course-detail/${courseId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setCourseStartDate(new Date(data.data.course.startDate));
                data.data.course.Lessons.sort((lesson1, lesson2) => {
                    if (lesson1.dayOfWeek !== lesson2.dayOfWeek) {
                        return lesson1.dayOfWeek - lesson2.dayOfWeek;
                    } else {
                        const startTime1 = lesson1.startTime
                            .split(":")
                            .map(Number);
                        const startTime2 = lesson2.startTime
                            .split(":")
                            .map(Number);

                        if (startTime1[0] !== startTime2[0]) {
                            return startTime1[0] - startTime2[0];
                        } else if (startTime1[1] !== startTime2[1]) {
                            return startTime1[1] - startTime2[1];
                        } else {
                            return startTime1[2] - startTime2[2];
                        }
                    }
                });
                setCourseDetail(data.data.course);
                setRegisteredStudents(data.data.registeredStudents);
            } else {
                console.error("Failed to fetch course data");
            }
        } catch (error) {
            console.error("Error fetching course data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [courseId]);
    const handleAddLesson = async () => {
        try {
            const response = await fetch(`${baseURL}/tutor/create-lesson`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    courseId: courseId,
                    ...formLesson,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`${data.error}`);
            }

            alert(data.message);

            fetchData();

            handleCloseDialog();
        } catch (error) {
            alert(`${error}`);
            console.error("Lỗi khi thêm buổi học:", error);
        }
    };
    const handleDeleteLesson = async (lessonId) => {
        try {
            const response = await fetch(`${baseURL}/tutor/delete-lesson`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ courseId, lessonId }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchData();
            } else if (response.status < 500) {
                alert(data.error);
            } else throw new Error(data.error);
        } catch (error) {
            console.error(error);
        }
    };
    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        let newValue = value;
        if (name === "startTime") {
            newValue = `${value}:00`;
        }

        setFormLesson({
            ...formLesson,
            [name]: newValue,
        });
    };
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="false">
                <Box
                    sx={{
                        bgcolor: "#f1f1f1",
                        minHeight: "100vh",
                        pt: 10,
                        pb: 4,
                    }}
                >
                    <Header />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            {courseDetail ? (
                                <Paper
                                    elevation={3}
                                    sx={{ p: 4, ml: 3.2, width: "100%" }}
                                >
                                    {" "}
                                    <Button
                                        variant="contained"
                                        sx={{ mb: 2 }}
                                        onClick={() => {
                                            window.history.back();
                                        }}
                                    >
                                        Quay lại
                                    </Button>
                                    <Grid container spacing={2}>
                                        {/* Tiêu Đề */}
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="h4"
                                                gutterBottom
                                            >
                                                {courseDetail &&
                                                    courseDetail.name}
                                            </Typography>
                                        </Grid>
                                        {/* Cặp Tiêu đề và Nội dung */}
                                        <Grid item xs={12} sm={2}>
                                            <Typography>Mô tả</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={10}>
                                            <Typography>
                                                :{" "}
                                                {courseDetail &&
                                                    courseDetail.description}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <Typography>Gia sư</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={10}>
                                            <Typography>
                                                :{" "}
                                                {courseDetail &&
                                                    courseDetail.Tutor.User
                                                        .name}
                                            </Typography>
                                        </Grid>
                                        <Grid item container xs={12} sm={6}>
                                            <Grid item xs={4}>
                                                <Typography variant="subtitle1">
                                                    Môn học
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="subtitle1">
                                                    :{" "}
                                                    {courseDetail &&
                                                        courseDetail.Subject
                                                            .name}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item container xs={12} sm={6}>
                                            <Grid item xs={4}>
                                                <Typography variant="subtitle1">
                                                    Số buổi
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="subtitle1">
                                                    :{" "}
                                                    {courseDetail &&
                                                        courseDetail.numberOfSessions}{" "}
                                                    Buổi
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item container xs={12} sm={6}>
                                            <Grid item xs={4}>
                                                <Typography variant="subtitle1">
                                                    Bắt đầu từ:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="subtitle1">
                                                    :{" "}
                                                    {courseDetail &&
                                                        formatDate(
                                                            courseDetail.startDate
                                                        )}
                                                </Typography>
                                            </Grid>
                                        </Grid>{" "}
                                        <Grid item container xs={12} sm={6}>
                                            <Grid item xs={4}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight="bold"
                                                    color="primary"
                                                >
                                                    Kết thúc dự kiến
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight="bold"
                                                    color="primary"
                                                >
                                                    :{" "}
                                                    {courseDetail &&
                                                        formatDate(
                                                            courseDetail.endDate
                                                        )}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item container xs={12} sm={6}>
                                            <Grid item xs={4}>
                                                <Typography variant="subtitle1">
                                                    Số học viên đã đăng ký
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="subtitle1">
                                                    :{" "}
                                                    {courseDetail &&
                                                    typeof registeredStudents !==
                                                        "undefined"
                                                        ? `${registeredStudents}`
                                                        : "Thông tin không khả dụng"}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item container xs={12} sm={6}>
                                            <Typography variant="subtitle1">
                                                Địa chỉ:{" "}
                                                {courseDetail.specificAddress},{" "}
                                                {courseDetail &&
                                                    districts.find(
                                                        (district) =>
                                                            district.id ==
                                                            courseDetail.location
                                                    )?.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ mt: 2 }}
                                    >
                                        <Grid item xs={10}>
                                            <Typography variant="h5">
                                                Danh sách buổi học
                                            </Typography>
                                        </Grid>
                                        {fromPage == "mycourse" &&
                                            role == 1 && (
                                                <Grid item xs={2}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        disabled={
                                                            currentDate >
                                                            courseStartDate
                                                        }
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleOpenDialog();
                                                        }}
                                                    >
                                                        Thêm buổi học
                                                    </Button>
                                                </Grid>
                                            )}
                                    </Grid>
                                    <TableContainer
                                        component={Paper}
                                        sx={{ mt: 2 }}
                                    >
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">
                                                        Thứ
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        Thời gian bắt đầu
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        Thời lượng (phút)
                                                    </TableCell>
                                                    {fromPage == "mycourse" &&
                                                        role == 1 && (
                                                            <TableCell align="center"></TableCell>
                                                        )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {courseDetail.Lessons &&
                                                courseDetail.Lessons.length >
                                                    0 ? (
                                                    courseDetail.Lessons.map(
                                                        (lesson) => (
                                                            <TableRow
                                                                key={lesson.id}
                                                            >
                                                                <TableCell align="center">
                                                                    {getDayOfWeekLabel(
                                                                        lesson.dayOfWeek
                                                                    )}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {
                                                                        lesson.startTime
                                                                    }
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {
                                                                        lesson.duration
                                                                    }
                                                                </TableCell>
                                                                {fromPage ==
                                                                    "mycourse" &&
                                                                    role ==
                                                                        1 && (
                                                                        <TableCell align="center">
                                                                            <Button
                                                                                onClick={() =>
                                                                                    handleDeleteLesson(
                                                                                        lesson.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                Xoá
                                                                            </Button>
                                                                        </TableCell>
                                                                    )}
                                                            </TableRow>
                                                        )
                                                    )
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={3}
                                                            align="center"
                                                        >
                                                            <Typography>
                                                                Không có buổi
                                                                học.
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>{" "}
                                    {(role == 2 || !token) && (
                                        <Grid container>
                                            <Grid
                                                item
                                                xs={12}
                                                mt={2}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight="bold"
                                                    style={{
                                                        textDecoration:
                                                            "underline",
                                                    }}
                                                >
                                                    Giá khoá học:{" "}
                                                    {courseDetail.price.toLocaleString(
                                                        "vi-VN"
                                                    ) + " VND"}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                mt={2}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                }}
                                            >
                                                {" "}
                                                <RegisterButton
                                                    courseId={courseDetail.id}
                                                    price={courseDetail.price}
                                                    status={courseDetail.status}
                                                />
                                            </Grid>
                                        </Grid>
                                    )}{" "}
                                </Paper>
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "50vh",
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            )}
                            <Dialog
                                open={isDialogOpen}
                                onClose={handleCloseDialog}
                            >
                                <DialogTitle>Thêm Buổi Học</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Điền thông tin để thêm buổi học mới.
                                    </DialogContentText>
                                    {/* Form điền thông tin buổi học */}
                                    <form>
                                        <Grid
                                            container
                                            direction="column"
                                            spacing={2}
                                        >
                                            <Grid item>
                                                <FormControl fullWidth>
                                                    <InputLabel id="day-select-label">
                                                        Thứ
                                                    </InputLabel>
                                                    <Select
                                                        labelId="day-select-label"
                                                        id="day-select"
                                                        value={
                                                            formLesson.dayOfWeek
                                                        }
                                                        name="dayOfWeek"
                                                        label="Thứ"
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    >
                                                        {dayOfWeek.map(
                                                            (day) => (
                                                                <MenuItem
                                                                    key={day}
                                                                    value={day}
                                                                >
                                                                    {getDayOfWeekLabel(
                                                                        day
                                                                    )}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    name="startTime"
                                                    margin="dense"
                                                    id="startTime"
                                                    label="Giờ bắt đầu"
                                                    type="time"
                                                    fullWidth
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={formLesson.startTime}
                                                    onChange={handleInputChange}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <FormControl fullWidth>
                                                    <InputLabel id="duration-select-label">
                                                        Thời lượng
                                                    </InputLabel>
                                                    <Select
                                                        name="duration"
                                                        labelId="duration-select-label"
                                                        id="duration-select"
                                                        value={
                                                            formLesson.duration
                                                        }
                                                        label="Thời lượng"
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    >
                                                        {duration.map(
                                                            (time) => (
                                                                <MenuItem
                                                                    key={time}
                                                                    value={time}
                                                                >{`${time} phút`}</MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog}>
                                        Hủy bỏ
                                    </Button>
                                    <Button onClick={handleAddLesson}>
                                        Thêm
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </Container>
                </Box>
            </Container>
            <Footer />
        </React.Fragment>
    );
}
