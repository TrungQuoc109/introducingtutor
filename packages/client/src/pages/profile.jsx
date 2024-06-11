import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Container,
    CssBaseline,
    Grid,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import Footer from "../components/footer";
import Header from "../components/header";
import { baseURL, firebaseConfig } from "../config/config";
// Firebase imports
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { DataContext } from "../dataprovider/subject";

export default function Profile() {
    const subjects = useContext(DataContext);
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const [imgURL, setImageUrl] = useState("");
    const [errors, setErrors] = useState({});

    const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        age: "",
        role: null,
        Tutor: { education: "", experience: "" },
        Student: { gradeLevel: "" },
    });
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^(0[1-9][0-9]{8}|\+84[1-9][0-9]{8})$/;
    const nameRegex = /^[\p{L} .]{4,30}$/u;

    const validateField = (name, value) => {
        let errorMsg = "";
        switch (name) {
            case "name":
                errorMsg =
                    value && nameRegex.test(value)
                        ? ""
                        : "Họ và Tên không đúng định dạng";
                break;

            case "email":
                errorMsg = emailRegex.test(value)
                    ? ""
                    : "Email không đúng định dạng";
                break;
            case "phoneNumber":
                errorMsg = phoneRegex.test(value)
                    ? ""
                    : "Số điện thoại không đúng định dạng";
                break;
            case "education":
                errorMsg = value ? "" : "Trình độ không được để trống";
                break;
            case "experience":
                errorMsg = value ? "" : "Kinh nghiệm không được để trống";
                break;
            case "gradeLevel":
                errorMsg = value ? "" : "Lớp không được để trống";
                break;
            case "age":
                errorMsg =
                    !isNaN(value) &&
                    parseInt(Number(value)) == value &&
                    value >= 3 &&
                    value <= 65
                        ? ""
                        : "Tuổi không hợp lệ (Học sinh: 3-18, Gia sư: 18-65)";
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
    };
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`${baseURL}/user/get-profile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data.data.user);

                    const subjectId = data.data.subjects.map(
                        (subject) => subject.id
                    );
                    setSelectedSubjectIds(subjectId);

                    const imageUrl = await fetchImageUrl(data.data.user.id);
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfileData({
            ...profileData,
            [name]: value,
        });
    };
    const handleSubjectChange = (event) => {
        setSelectedSubjectIds(event.target.value);
    };

    const renderSubjectNames = (selectedIds) => {
        return selectedIds
            .map(
                (id) => subjects.data.find((subject) => subject.id === id).name
            )
            .join(", ");
    };
    const handleExtraInfoChange = (event) => {
        const { name, value } = event.target;
        if (profileData.role === 1) {
            // Tutor
            setProfileData({
                ...profileData,
                Tutor: { ...profileData.Tutor, [name]: value },
            });
        } else if (profileData.role === 2) {
            // Student
            setProfileData({
                ...profileData,
                Student: { ...profileData.Student, [name]: value },
            });
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        try {
            console.log(profileData);
            const response = await fetch(`${baseURL}/user/update-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });
            if (response.ok) {
                // Handle success update
                console.log("Profile Updated Successfully");
            } else {
                // Handle failure
                console.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="false">
                <Box
                    sx={{
                        bgcolor: "#f1f1f1",
                        minHeight: "100vh",
                        pt: 12,
                        pb: 4,
                    }}
                >
                    <Header />
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                bgcolor: "white",
                                p: 4,
                            }}
                        >
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Box
                                        component="img"
                                        src={imgURL}
                                        alt="Profile"
                                        sx={{
                                            width: 300,
                                            height: 300,
                                            objectFit: "contain",
                                            ml: 16,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        name="name"
                                        variant="outlined"
                                        value={profileData.name}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        variant="outlined"
                                        value={profileData.email}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        name="phoneNumber"
                                        variant="outlined"
                                        value={profileData.phoneNumber}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Age"
                                        name="age"
                                        variant="outlined"
                                        value={profileData.age}
                                        onChange={handleChange}
                                        margin="normal"
                                    />

                                    {profileData.role == 1 && (
                                        <>
                                            <TextField
                                                fullWidth
                                                label="Education"
                                                name="education"
                                                variant="outlined"
                                                value={
                                                    profileData.Tutor.education
                                                }
                                                onChange={handleExtraInfoChange}
                                                margin="normal"
                                            />
                                            <TextField
                                                fullWidth
                                                label="Experience"
                                                name="experience"
                                                variant="outlined"
                                                value={
                                                    profileData.Tutor.experience
                                                }
                                                onChange={handleExtraInfoChange}
                                                margin="normal"
                                            />
                                            <FormControl
                                                fullWidth
                                                margin="normal"
                                            >
                                                <InputLabel id="subject-multiple-select-label">
                                                    Môn Học
                                                </InputLabel>
                                                <Select
                                                    labelId="subject-multiple-select-label"
                                                    id="subject-multiple-select"
                                                    multiple
                                                    value={selectedSubjectIds}
                                                    onChange={
                                                        handleSubjectChange
                                                    }
                                                    renderValue={
                                                        renderSubjectNames
                                                    }
                                                >
                                                    {subjects.data.map(
                                                        (subject) => (
                                                            <MenuItem
                                                                key={subject.id}
                                                                value={
                                                                    subject.id
                                                                }
                                                            >
                                                                {subject.name}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </>
                                    )}
                                    {profileData.role == 2 && (
                                        <TextField
                                            fullWidth
                                            label="Grade Level"
                                            name="gradeLevel"
                                            variant="outlined"
                                            value={
                                                profileData.Student.gradeLevel
                                            }
                                            onChange={handleExtraInfoChange}
                                            margin="normal"
                                        />
                                    )}
                                    <Button
                                        disabled={
                                            profileData.role == 0 ? true : false
                                        }
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                </Box>
                <Footer />
            </Container>
        </React.Fragment>
    );
}
