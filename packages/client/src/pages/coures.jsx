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
    CircularProgress,
} from "@mui/material";
import Header from "../components/header";
import Footer from "../components/Footer";
import { baseURL, districts, formatDate, statusCourse } from "../config/config";
import { DataContext } from "../dataprovider/subject";
import SearchBar from "../components/searchBar";
import { useNavigate } from "react-router-dom";
import RegisterButton from "../components/registerButton";

function CoursePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [subject, setSubject] = useState("");
    const [location, setLocation] = useState("");
    const [error, setError] = useState("");
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);
    const subjects = useContext(DataContext);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const performSearch = (event) => {
        if (event) event.preventDefault();

        // Initialize base URL for API
        const baseApiUrl = `${baseURL}/user/search-course`;

        // Use URLSearchParams to build query parameters
        const searchParams = new URLSearchParams();
        searchParams.append("page", page);
        if (searchTerm) searchParams.append("searchTerm", searchTerm);
        if (subject) searchParams.append("subjectId", subject);
        if (location) searchParams.append("location", location);

        const apiUrl = `${baseApiUrl}?${searchParams.toString()}`;
        setLoading(true);
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setTotalPages(data.data.page);
                setCourses(data.data.courses);
                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "There was an issue fetching the course data:",
                    error
                );
                setError(error.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${baseURL}/user/get-courses/${page}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                setCourses(data.data.teachingSubjects);
                setTotalPages(data.data.page);
                setLoading(false);
            } catch (error) {
                console.error(
                    "There was an issue fetching the course data:",
                    error
                );
                setError(error.message);
                setLoading(false);
            }
        };
        fetchCourses();
    }, [page]);

    const navigateToTutorProfile = (tutorId) => {
        navigate(`/tutor-detail`, { state: { tutorId: tutorId } });
    };

    const navigateToCourseDetail = (courseId) => {
        navigate(`/course-detail/${courseId}`);
    };

    const handleChange = (event, newValue) => {
        setPage(newValue);
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth={false}>
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
                            setLocation={setLocation}
                            subjects={subjects}
                            performSearch={performSearch}
                        />

                        {loading ? (
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
                        ) : (
                            <Grid container spacing={3} mt={2}>
                                {courses.length === 0 ? (
                                    <Typography
                                        color="textSecondary"
                                        align="center"
                                        sx={{ width: "100%", mt: 2 }}
                                    >
                                        Không có khóa học nào
                                    </Typography>
                                ) : (
                                    courses.map((course) => (
                                        <ListItem
                                            key={course.id}
                                            divider
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <Grid
                                                container
                                                spacing={2}
                                                alignItems="center"
                                            >
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={8}
                                                    md={8}
                                                    onClick={() =>
                                                        navigateToCourseDetail(
                                                            course.id
                                                        )
                                                    }
                                                >
                                                    <ListItemText
                                                        primary={`${course.name}`}
                                                        secondary={
                                                            <React.Fragment>
                                                                <Grid
                                                                    container
                                                                    spacing={2}
                                                                    alignItems="center"
                                                                >
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                    >
                                                                        <Typography
                                                                            component="span"
                                                                            variant="body1"
                                                                            color="textPrimary"
                                                                            maxWidth={
                                                                                200
                                                                            }
                                                                        >
                                                                            Mô
                                                                            tả:{" "}
                                                                            {
                                                                                course.description
                                                                            }
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={4}
                                                                    >
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
                                                                    <Grid
                                                                        item
                                                                        xs={4}
                                                                    >
                                                                        <Typography
                                                                            component="span"
                                                                            variant="body2"
                                                                            color="textPrimary"
                                                                        >
                                                                            Lớp:{" "}
                                                                            {
                                                                                course.gradeLevel
                                                                            }
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={4}
                                                                    >
                                                                        <Typography
                                                                            component="span"
                                                                            variant="body2"
                                                                            color="textPrimary"
                                                                        >
                                                                            Ngày
                                                                            bắt
                                                                            đầu:{" "}
                                                                            {formatDate(
                                                                                course.startDate
                                                                            )}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        container
                                                                    >
                                                                        <Grid
                                                                            item
                                                                            xs={
                                                                                8
                                                                            }
                                                                        >
                                                                            <Typography
                                                                                component="span"
                                                                                variant="body2"
                                                                                color="textSecondary"
                                                                            >
                                                                                Địa
                                                                                chỉ:{" "}
                                                                                {`${
                                                                                    course.specificAddress
                                                                                }, ${
                                                                                    districts.find(
                                                                                        (
                                                                                            district
                                                                                        ) =>
                                                                                            district.id ===
                                                                                            course.location
                                                                                    )
                                                                                        ?.name
                                                                                }`}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={
                                                                                4
                                                                            }
                                                                        >
                                                                            <Typography
                                                                                component="span"
                                                                                variant="body2"
                                                                                color="black"
                                                                            >
                                                                                Trạng
                                                                                thái:{" "}
                                                                                {
                                                                                    statusCourse[
                                                                                        course
                                                                                            .status
                                                                                    ]
                                                                                }
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={4}
                                                    md={4}
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: {
                                                            xs: "flex-start",
                                                            sm: "flex-end",
                                                        },
                                                    }}
                                                >
                                                    <Typography
                                                        color="textPrimary"
                                                        sx={{
                                                            fontWeight: "bold",
                                                            mb: 1,
                                                        }}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            navigateToTutorProfile(
                                                                course.Tutor.id
                                                            );
                                                        }}
                                                    >
                                                        Gia sư:{" "}
                                                        {course.Tutor.User.name}
                                                    </Typography>
                                                    <RegisterButton
                                                        courseId={course.id}
                                                        price={course.price}
                                                        status={course.status}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    ))
                                )}
                            </Grid>
                        )}
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
            </Container>
            <Footer />
        </React.Fragment>
    );
}

export default CoursePage;
