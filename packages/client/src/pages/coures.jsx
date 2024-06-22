import React, { useContext, useEffect, useState } from "react";
import {
    Container,
    Box,
    Grid,
    Typography,
    CssBaseline,
    Tabs,
    Tab,
    ListItem,
    ListItemText,
    Button,
} from "@mui/material";
import Header from "../components/header";
import Footer from "../components/footer";
import { baseURL, districts, formatDate } from "../config/config";
import { DataContext } from "../dataprovider/subject";
import SearchBar from "../components/searchBar";
import { useNavigate } from "react-router-dom";
import RegisterButton from "../components/registerButton";

function CoursePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [subject, setSubject] = useState("");
    const [location, setlocation] = useState("");
    const [error, setError] = useState("");
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);
    const subjects = useContext(DataContext);
    const [totalPages, setTotalPages] = useState(0);
    const [clickedCourseId, setClickedCourseId] = useState(null);
    const navigate = useNavigate();
    const performSearch = () => {
        event.preventDefault();
        console.log(
            "Searching for:",
            searchTerm,
            "Subject:",
            subject,
            " location:",
            location
        );
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    };
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(
                    `${baseURL}/user/get-courses/${page}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.data);
                setCourses(data.data.teachingSubjects);
                setTotalPages(data.data.page);
            } catch (error) {
                console.log(error);
                setError(error.message);
            }
        };
        fetchCourses();
    }, [page]);
    const navigateToTutorProfile = (tutorId) => {
        navigate(`/tutor-detail`, { state: { tutorId: tutorId } });
    };
    const navigateToCourseDetail = (courseId) => {
        // Sử dụng navigate từ 'useNavigate' để chuyển sang trang CourseDetail
        navigate(`/course-detail/${courseId}`);
    };
    const handleChange = (event, newValue) => {
        setPage(newValue);
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
                        <SearchBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            subject={subject}
                            setSubject={setSubject}
                            location={location}
                            setLocation={setlocation}
                            subjects={subjects}
                            performSearch={performSearch}
                            handleKeyPress={handleKeyPress}
                        />

                        <Grid container spacing={3} mt={2}>
                            {courses.map((course) => (
                                <ListItem
                                    key={course.id}
                                    divider
                                    onClick={() =>
                                        navigateToCourseDetail(course.id)
                                    }
                                >
                                    {/* Phần còn lại của mã ListItem */}
                                    <Grid
                                        container
                                        spacing={2}
                                        alignItems="center"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Grid
                                            item
                                            xs={8}
                                            sx={{
                                                ...(clickedCourseId ===
                                                    course.id && {
                                                    bgcolor: "primary.light",
                                                    color: "white",
                                                    transition: "all 0.5s ease",
                                                }),
                                                cursor: "pointer",
                                            }}
                                        >
                                            <ListItemText
                                                primary={`${course.name} `}
                                                secondary={
                                                    <React.Fragment>
                                                        <Grid
                                                            container
                                                            spacing={2}
                                                            alignItems="center"
                                                        >
                                                            <Grid item xs={12}>
                                                                <Typography
                                                                    component={
                                                                        "span"
                                                                    }
                                                                    variant="body1"
                                                                    color={
                                                                        "InfoText"
                                                                    }
                                                                    maxWidth={
                                                                        200
                                                                    }
                                                                >
                                                                    Mô tả :
                                                                    {
                                                                        course.description
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="textPrimary"
                                                                    sx={{
                                                                        minWidth: 80,
                                                                    }}
                                                                >
                                                                    Môn:{" "}
                                                                    {
                                                                        course
                                                                            .Subject
                                                                            .name
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="textPrimary"
                                                                >
                                                                    | Lớp:{" "}
                                                                    {
                                                                        course.gradeLevel
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="textPrimary"
                                                                >
                                                                    | Ngày bắt
                                                                    đầu:{" "}
                                                                    {formatDate(
                                                                        course.startDate
                                                                    )}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="textSecondary"
                                                                >
                                                                    Địa chỉ:{" "}
                                                                    {
                                                                        districts.find(
                                                                            (
                                                                                district
                                                                            ) =>
                                                                                district.id ==
                                                                                course.location
                                                                        ).name
                                                                    }{" "}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </React.Fragment>
                                                }
                                            />
                                        </Grid>
                                        {/* Cách render nút Đăng ký dưới đây */}
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-end",
                                            }}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                style={{
                                                    fontWeight: "bold",
                                                    marginBottom: "8px", // Khoảng cách giữa tên và nút
                                                }}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    navigateToTutorProfile(
                                                        course.Tutor.id
                                                    );
                                                }} // Thêm handler cho sự kiện click
                                            >
                                                Gia sư: {course.Tutor.User.name}
                                            </Typography>
                                            <RegisterButton
                                                courseId={course.id}
                                                price={course.price}
                                            />
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            ))}
                        </Grid>
                        <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item xs={12}>
                                <Tabs
                                    value={page}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable prevent tabs example"
                                    sx={{
                                        display: "flex",
                                        mt: 2,
                                        justifyContent: "center",
                                        ".MuiTabs-flexContainer": {
                                            justifyContent: "center",
                                        },
                                        ".MuiTabs-scroller": {
                                            justifyContent: "center",
                                            flex: "none",
                                        },
                                    }}
                                >
                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => (
                                            <Tab
                                                key={index}
                                                label={`${index + 1}`}
                                                sx={{ bgcolor: "white" }}
                                            />
                                        )
                                    )}
                                </Tabs>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
                <Footer />
            </Container>
        </React.Fragment>
    );
}

export default CoursePage;
