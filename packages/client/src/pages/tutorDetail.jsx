import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Container,
    CssBaseline,
    Grid,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
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
import Footer from "../components/footer";
import logo from "../../public/image/Logo_STU.png";
// Mock data, replace this with your data fetching logic

export default function TutorDetail() {
    const [profileData, setProfileData] = useState(null);
    const subjects = useContext(DataContext);
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const [imgURL, setImageUrl] = useState("");
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
    const [clickedCourseId, setClickedCourseId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const tutorId = location.state.tutorId;
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
                    console.log(data.data.tutor);
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
    const handleCourseClick = (courseId) => {
        // Sử dụng navigate để chuyển trang, thêm courseId vào đường dẫn
        navigate(`/course-detail/${courseId}`);
    };
    const renderNames = (selectedIds, array) => {
        let itemsArray = Array.isArray(array) ? array : array.data;
        return selectedIds
            .map((id) => itemsArray.find((item) => item.id === id)?.name)
            .filter((name) => name) // Lọc ra các giá trị undefined hoặc null
            .join(", ");
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
                            <Grid item xs={12} md={4}>
                                {/* Assumed profile image place */}
                                <Box
                                    component="img"
                                    sx={{
                                        height: 233,
                                        width: 350,
                                        borderRadius: "4px",
                                        objectFit: "contain",
                                    }}
                                    alt="The house from the offer."
                                    src={imgURL ?? logo} // Replace with profile.imageUrl if available
                                />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography variant="h4">
                                    Gia sư:{" "}
                                    {profileData && profileData.User.name}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Tuổi: {profileData && profileData.User.age}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Trình độ:{" "}
                                    {profileData && profileData.education}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Kinh nghiệm:{" "}
                                    {profileData && profileData.experience} năm
                                </Typography>
                                {subjects && (
                                    <Typography variant="subtitle1">
                                        Môn học:{" "}
                                        {renderNames(
                                            selectedSubjectIds,
                                            subjects
                                        )}
                                    </Typography>
                                )}
                                <Typography variant="subtitle1">
                                    Địa chỉ:{" "}
                                    {renderNames(selectedAddresses, districts)}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom>
                                    Khóa học
                                </Typography>
                                {profileData &&
                                    profileData.TeachingSubjects && (
                                        <List>
                                            {profileData.TeachingSubjects.map(
                                                (course) => (
                                                    <ListItem
                                                        key={course.id}
                                                        divider
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
                                                            {/* Cách render nút Đăng ký dưới đây */}
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
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={(
                                                                        event
                                                                    ) => {
                                                                        event.stopPropagation(); // Ngăn chặn sự kiện lan tỏa
                                                                        // cancelRegistration(
                                                                        //     course.id
                                                                        // );
                                                                        console.log(
                                                                            "dang ky"
                                                                        );
                                                                    }}
                                                                >
                                                                    Giá:{" "}
                                                                    {!isNaN(
                                                                        course.price
                                                                    )
                                                                        ? course.price.toLocaleString(
                                                                              "vi-VN"
                                                                          )
                                                                        : "N/A"}{" "}
                                                                    VND
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                )
                                            )}
                                        </List>
                                    )}
                            </Grid>
                        </Grid>{" "}
                    </Container>
                </Box>
                <Footer />
            </Container>
        </React.Fragment>
    );
}
