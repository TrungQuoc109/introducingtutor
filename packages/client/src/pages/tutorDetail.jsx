import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Container,
    CssBaseline,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { DataContext } from "../dataprovider/subject";
import {
    baseURL,
    districts,
    firebaseConfig,
    formatDate,
} from "../config/config";
import Header from "../components/header";
import Footer from "../components/Footer";
import logo from "../../public/image/Logo_STU.png";
import RegisterButton from "../components/registerButton";

export default function TutorDetail() {
    const [profileData, setProfileData] = useState(null);
    const subjects = useContext(DataContext);
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const [imgURL, setImageUrl] = useState("");
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [clickedCourseId, setClickedCourseId] = useState(null);
    const location = useLocation();
    const tutorId = location.state.tutorId;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${baseURL}/user/get-tutor-detail/${tutorId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();

                    setProfileData(data.data.tutor);

                    const subjectId = data.data.tutor.TutorSubjectMaps.map(
                        (map) => map.Subject.id
                    );
                    const addressIds = data.data.tutor.Locations.map(
                        (add) => add.districtsId
                    );

                    setSelectedSubjectIds(subjectId);
                    setSelectedAddresses(addressIds);
                    const imageUrl = await fetchImageUrl(
                        data.data.tutor.User.id
                    );
                    setImageUrl(imageUrl);
                } else {
                    console.error("Failed to fetch profile data");
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false); // Set loading to false regardless of success or error
            }
        };
        fetchData();
    }, []);

    const fetchImageUrl = async (filePath) => {
        const fileRef = ref(storage, `avatar/${filePath}`);
        try {
            const downloadUrl = await getDownloadURL(fileRef);
            return downloadUrl;
        } catch (error) {
            console.error("Cannot fetch URL", error);
            return null;
        }
    };

    const renderNames = (selectedIds, array) => {
        let itemsArray = Array.isArray(array) ? array : array.data;
        const sortedSelectedIds = selectedIds.sort((a, b) =>
            a
                .toString()
                .localeCompare(b.toString(), undefined, { numeric: true })
        );

        return sortedSelectedIds
            .map((id) => itemsArray.find((item) => item.id === id)?.name)
            .filter((name) => name)
            .join(", ");
    };

    const navigateToCourseDetail = (courseId) => {
        navigate(`/course-detail/${courseId}`);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

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
                            <Grid item xs={12} md={4}>
                                <Box
                                    component="img"
                                    sx={{
                                        height: 233,
                                        width: 350,
                                        borderRadius: "4px",
                                        objectFit: "contain",
                                    }}
                                    alt="The house from the offer."
                                    src={imgURL ?? logo}
                                />
                            </Grid>
                            <Grid item xs={12} md={8} container>
                                <Grid item xs={12}>
                                    <Typography variant="h4" gutterBottom>
                                        Gia sư:{" "}
                                        {profileData && profileData.User.name}
                                    </Typography>
                                </Grid>

                                <Grid item xs={2}>
                                    <Typography variant="subtitle1">
                                        Tuổi
                                    </Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="subtitle1">
                                        : {profileData && profileData.User.age}
                                    </Typography>
                                </Grid>

                                <Grid item xs={2}>
                                    <Typography variant="subtitle1">
                                        Trình độ
                                    </Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="subtitle1">
                                        : {profileData && profileData.education}
                                    </Typography>
                                </Grid>

                                <Grid item xs={2}>
                                    <Typography variant="subtitle1">
                                        Kinh nghiệm
                                    </Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="subtitle1">
                                        :{" "}
                                        {profileData && profileData.experience}{" "}
                                    </Typography>
                                </Grid>

                                {subjects && (
                                    <>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle1">
                                                Môn học
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Typography variant="subtitle1">
                                                :{" "}
                                                {renderNames(
                                                    selectedSubjectIds,
                                                    subjects
                                                )}
                                            </Typography>
                                        </Grid>
                                    </>
                                )}

                                <Grid item xs={2}>
                                    <Typography variant="subtitle1">
                                        Địa chỉ
                                    </Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="subtitle1">
                                        :{" "}
                                        {renderNames(
                                            selectedAddresses,
                                            districts
                                        )}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom>
                                    Khóa học
                                </Typography>
                                {profileData &&
                                profileData.TeachingSubjects &&
                                profileData.TeachingSubjects.length === 0 ? (
                                    <Typography
                                        variant="body1"
                                        align="center"
                                        gutterBottom
                                    >
                                        Chưa có khoá học nào
                                    </Typography>
                                ) : (
                                    <List>
                                        {profileData &&
                                            profileData.TeachingSubjects &&
                                            profileData.TeachingSubjects.map(
                                                (course) => (
                                                    <ListItem
                                                        key={course.id}
                                                        divider
                                                        onClick={() =>
                                                            navigateToCourseDetail(
                                                                course.id
                                                            )
                                                        }
                                                    >
                                                        <Grid
                                                            container
                                                            spacing={2}
                                                            alignItems="center"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <Grid
                                                                item
                                                                xs={8}
                                                                sx={{
                                                                    ...(clickedCourseId ===
                                                                        course.id && {
                                                                        bgcolor:
                                                                            "primary.light",
                                                                        color: "white",
                                                                        transition:
                                                                            "all 0.5s ease",
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
                                                                                spacing={
                                                                                    2
                                                                                }
                                                                                alignItems="center"
                                                                            >
                                                                                <Grid
                                                                                    item
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                >
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
                                                                                        Mô
                                                                                        tả
                                                                                        :
                                                                                        {
                                                                                            course.description
                                                                                        }
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs
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
                                                                                    xs
                                                                                >
                                                                                    <Typography
                                                                                        component="span"
                                                                                        variant="body2"
                                                                                        color="textPrimary"
                                                                                    >
                                                                                        |
                                                                                        Lớp:{" "}
                                                                                        {
                                                                                            course.gradeLevel
                                                                                        }
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs
                                                                                >
                                                                                    <Typography
                                                                                        component="span"
                                                                                        variant="body2"
                                                                                        color="textPrimary"
                                                                                    >
                                                                                        |
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
                                                                                    xs={
                                                                                        12
                                                                                    }
                                                                                >
                                                                                    <Typography
                                                                                        component="span"
                                                                                        variant="body2"
                                                                                        color="textPrimary"
                                                                                    >
                                                                                        Địa
                                                                                        chỉ:{" "}
                                                                                        {
                                                                                            districts.find(
                                                                                                (
                                                                                                    district
                                                                                                ) =>
                                                                                                    district.id ==
                                                                                                    course.location
                                                                                            )
                                                                                                .name
                                                                                        }{" "}
                                                                                    </Typography>
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
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    flexDirection:
                                                                        "column",
                                                                    alignItems:
                                                                        "flex-end",
                                                                }}
                                                            >
                                                                <RegisterButton
                                                                    courseId={
                                                                        course.id
                                                                    }
                                                                    price={
                                                                        course.price
                                                                    }
                                                                    status={
                                                                        course.status
                                                                    }
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                )
                                            )}
                                    </List>
                                )}
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Container>
            <Footer />
        </React.Fragment>
    );
}
