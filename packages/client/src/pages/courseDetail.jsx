import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Container,
    CssBaseline,
    Grid,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { DataContext } from "../dataprovider/subject";
import { baseURL, districts, formatDate } from "../config/config";
import Header from "../components/header";
import Footer from "../components/footer";
// Mock data, replace this with your data fetching logic

export default function CourseDetail() {
    const [courseDetail, setCourseDetail] = useState(null); // Thêm state để lưu thông tin khóa học
    const subjects = useContext(DataContext);

    const { courseId } = useParams();
    useEffect(() => {
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
                    console.log(data.data.course);
                    setCourseDetail(data.data.course);
                } else {
                    console.error("Failed to fetch course data");
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };
        fetchData();
    }, [courseId]);

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
                                    sx={{ p: 4, width: "100%" }}
                                >
                                    <Typography variant="h4" gutterBottom>
                                        {courseDetail && courseDetail.name}
                                    </Typography>
                                    <Typography>
                                        Mô tả:{" "}
                                        {courseDetail &&
                                            courseDetail.description}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        Môn học:{" "}
                                        {courseDetail &&
                                            courseDetail.Subject.name}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        Lớp:{" "}
                                        {courseDetail &&
                                            courseDetail.gradeLevel}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        Số buổi:{" "}
                                        {courseDetail &&
                                            courseDetail.numberOfSessions}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        Số học viên:{" "}
                                        {courseDetail &&
                                            courseDetail.studentCount}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        Giá:{" "}
                                        {courseDetail &&
                                        !isNaN(courseDetail.price)
                                            ? courseDetail.price.toLocaleString(
                                                  "vi-VN"
                                              )
                                            : "N/A"}{" "}
                                        VND
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        Bắt đầu từ:{" "}
                                        {courseDetail &&
                                            formatDate(courseDetail.startDate)}
                                    </Typography>
                                    <Typography paragraph>
                                        Địa chỉ:{" "}
                                        {courseDetail &&
                                            districts.find(
                                                (district) =>
                                                    district.id ==
                                                    courseDetail.location
                                            ).name}
                                    </Typography>{" "}
                                    <Typography variant="h5" gutterBottom>
                                        Danh sách buổi học
                                    </Typography>
                                    <List>
                                        {courseDetail.Lessons &&
                                        courseDetail.Lessons.length > 0 ? (
                                            courseDetail.Lessons.map(
                                                (lesson) => (
                                                    <ListItem key={lesson.id}>
                                                        <ListItemText
                                                            primary={
                                                                lesson.title
                                                            }
                                                            secondary={`Ngày: ${formatDate(
                                                                lesson.date
                                                            )}, Thời gian bắt đầu: ${
                                                                lesson.startTime
                                                            }, Thời lượng: ${
                                                                lesson.duration
                                                            } phút`}
                                                        />
                                                    </ListItem>
                                                )
                                            )
                                        ) : (
                                            <Typography>
                                                Không có buổi học.
                                            </Typography>
                                        )}
                                    </List>
                                </Paper>
                            ) : (
                                <Typography variant="body1">
                                    Đang tải thông tin khóa học...
                                </Typography>
                            )}
                        </Grid>
                    </Container>
                </Box>
                <Footer />
            </Container>
        </React.Fragment>
    );
}
