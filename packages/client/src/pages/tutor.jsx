import React, { useContext, useEffect, useState } from "react";
import {
    Container,
    Box,
    Grid,
    Paper,
    Typography,
    CssBaseline,
    Card,
    CardMedia,
    CardContent,
    InputBase,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Tabs,
    Tab,
} from "@mui/material";
import CardActionArea from "@mui/material/CardActionArea";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../components/header";
import Footer from "../components/footer";
import { baseURL, firebaseConfig } from "../config/config";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { DataContext } from "../dataprovider/subject";

function TutorPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [subject, setSubject] = useState("");
    const [education, seteducation] = useState("");
    const [error, setError] = useState("");
    const [tutors, setTutors] = useState([]);
    const [page, setPage] = useState(0);
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const subjects = useContext(DataContext);
    const [totalPages, setTotalPages] = useState(0);
    const educations = [
        { id: "1", name: "Sinh viên" },
        { id: "2", name: "Giáo viên" },
        { id: "3", name: "Giáo viên tiểu học" },
        { id: "4", name: "Giáo viên THCS" },
        { id: "5", name: "Giáo viên THPT" },
        { id: "6", name: "Giảng viên Đại học" },
    ];

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
    };
    const handleEduChange = (event) => {
        seteducation(event.target.value);
    };

    const performSearch = () => {
        event.preventDefault();
        console.log(
            "Searching for:",
            searchTerm,
            "Subject:",
            subject,
            " education:",
            education
        );
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    };
    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const response = await fetch(
                    `${baseURL}/user/get-tutors/${page}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.data.page);
                setTotalPages(data.data.page);
                setTutors(data.data.tutors);
            } catch (error) {
                console.log(error);
                setError(error.message);
            }
        };
        fetchTutors();
    }, [page]);
    const [tutorCards, setTutorCards] = useState([]); // This state will hold your tutors along with their image URLs

    useEffect(() => {
        // Assuming `tutors` is available as a prop or state
        const fetchAllImageUrls = async () => {
            const tutorsWithImages = await Promise.all(
                tutors.map(async (tutor) => {
                    const imageUrl = await fetchImageUrl(tutor.User.id); // Call your function to fetch image URL
                    return { ...tutor, imageUrl }; // Spread tutor properties and add `imageUrl`
                })
            );

            setTutorCards(tutorsWithImages);
        };

        fetchAllImageUrls();
    }, [tutors]);
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
                        <Grid spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Paper
                                    component="form"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Tìm kiếm..."
                                        inputProps={{ "aria-label": "search" }}
                                        value={searchTerm}
                                        onChange={handleSearchTermChange}
                                        onKeyDown={handleKeyPress}
                                    />
                                    <FormControl sx={{ width: 160 }}>
                                        {" "}
                                        <InputLabel id="education-select-label">
                                            Trình độ
                                        </InputLabel>
                                        <Select
                                            labelId="education-select-label"
                                            id="education-select"
                                            value={education}
                                            onChange={handleEduChange}
                                            label="Môn học"
                                        >
                                            {educations.map((subj) => (
                                                <MenuItem
                                                    key={subj.id}
                                                    value={subj.id}
                                                >
                                                    {subj.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ mx: 1, width: 140 }}>
                                        <InputLabel id="subject-select-label">
                                            Môn học
                                        </InputLabel>
                                        <Select
                                            labelId="subject-select-label"
                                            id="subject-select"
                                            value={subject}
                                            onChange={handleSubjectChange}
                                            label="Môn học"
                                        >
                                            {subjects &&
                                                subjects.data.map((subj) => (
                                                    <MenuItem
                                                        key={subj.id}
                                                        value={subj.id}
                                                    >
                                                        {subj.name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>

                                    <IconButton
                                        type="submit"
                                        sx={{ p: "10px" }}
                                        aria-label="search"
                                        onClick={performSearch}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} mt={4}>
                            {tutorCards &&
                                tutorCards.map((card) => (
                                    <Grid item xs={12} md={3} key={card.id}>
                                        <Card sx={{ maxHeight: 500 }}>
                                            <CardActionArea>
                                                <CardMedia
                                                    component="img"
                                                    image={card.imageUrl}
                                                    alt="Image title"
                                                    sx={{
                                                        // height: "100%",
                                                        height: 300,
                                                        width: "100%",
                                                        objectFit: "contain",
                                                        border: "1px solid #ccc",
                                                        boxShadow:
                                                            "0 4px 12px 0 rgba(0, 0, 0, 0.2)",
                                                    }}
                                                />
                                                <CardContent>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {card.User.name}
                                                    </Typography>
                                                    <Typography variant="subtitle1">
                                                        {card.education}
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {card.experience}
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis", // Thêm nếu bạn muốn hiển thị dấu "..."
                                                            whiteSpace:
                                                                "nowrap", // Đảm bảo nội dung không bị gãy dòng
                                                        }}
                                                    >
                                                        {card.TutorSubjectMaps.map(
                                                            (element) => (
                                                                <span
                                                                    key={
                                                                        element
                                                                            .Subject
                                                                            .id
                                                                    }
                                                                >
                                                                    {
                                                                        element
                                                                            .Subject
                                                                            .name
                                                                    }
                                                                    ,{" "}
                                                                </span>
                                                            )
                                                        )}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
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

export default TutorPage;
