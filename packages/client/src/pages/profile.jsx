import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Container,
    CssBaseline,
    Grid,
    Typography,
    TextField,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Chip,
    MenuItem,
    FormControlLabel,
    FormLabel,
    RadioGroup,
    Radio,
} from "@mui/material";
import Footer from "../components/footer";
import Header from "../components/header";
import { baseURL, districts, firebaseConfig } from "../config/config";
// Firebase imports
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { DataContext } from "../dataprovider/subject";
import logo from "../../public/image/Logo_STU.png";
import { useNavigate } from "react-router-dom";
import Schedule from "../components/schedule";
import SubjectSelect from "../components/selected";
export default function Profile() {
    const username = sessionStorage.getItem("username");
    const token = localStorage.getItem(username);
    const role = localStorage.getItem(username + "_role");
    const subjects = useContext(DataContext);
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const [imgURL, setImageUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
    const [schedule, setSchedule] = useState();
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const [oldEmail, setOldEmail] = useState("");
    const navigate = useNavigate();

    const handleSubjectChange = (newSelectedSubjects) => {
        setIsChange(true);
        setSelectedSubjectIds(newSelectedSubjects);
    };

    const handleLocationChange = (newSelectedLocation) => {
        setIsChange(true);
        setSelectedAddresses(newSelectedLocation);
    };
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        age: "",
        gender: "",
        role: null,
        Tutor: { education: "", experience: "" },
        Student: { gradeLevel: "" },
    });
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^(0[1-9][0-9]{8}|\+84[1-9][0-9]{8})$/;
    const nameRegex = /^[\p{L} .]{4,30}$/u;
    const passwordRegex =
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-`~!@#$%^&*()_+={}[\\]|\:\;\"\'\<\>\,\.?\/]).{8,30}$/;
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
                errorMsg =
                    !isNaN(value) &&
                    parseInt(Number(value)) == value &&
                    value > 0 &&
                    value <= 12
                        ? ""
                        : "Lớp không được để trống";
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
    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra các trường cơ bản
        if (!profileData.name) newErrors.name = "Họ và Tên không được để trống";

        if (!profileData.email || !emailRegex.test(profileData.email)) {
            newErrors.email = "Email không đúng định dạng";
        }
        if (
            !profileData.phoneNumber ||
            !phoneRegex.test(profileData.phoneNumber)
        ) {
            newErrors.phoneNumber = "Số điện thoại không đúng định dạng";
        }
        if (
            isNaN(profileData.age) ||
            parseInt(Number(profileData.age)) != profileData.age ||
            profileData.age < 3 ||
            profileData.age > 65
        ) {
            newErrors.age = "Tuổi không hợp lệ (Học sinh: 3-18, Gia sư: 18-65)";
        }
        if (profileData.role == 1) {
            // Kiểm tra các trường trong educationLevel hoặc gradeLevel
            if (!profileData.Tutor.education)
                newErrors.education = "Trình độ không được để trống";
            if (!profileData.Tutor.experience)
                newErrors.experience = "Kinh nghiệm không được để trống";
        } else if (profileData.role == 2) {
            if (!profileData.Student.gradeLevel)
                newErrors.gradeLevel = "Lớp không được để trống";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length == 0;
    };
    useEffect(() => {
        fetchData();
        fecthSchedule();
    }, []);
    const fetchData = async () => {
        try {
            const response = await fetch(`${baseURL}/user/get-profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setProfileData(data.data.user);
                setOldEmail(data.data.user.email);
                if (role == 1) {
                    const subjectId = data.data.subjects.map(
                        (subject) => subject.id
                    );
                    const addressIds = data.data.address.map(
                        (add) => add.districtsId
                    );
                    setSelectedSubjectIds(subjectId);
                    setSelectedAddresses(addressIds);
                }

                const imageUrl = await fetchImageUrl(data.data.user.id);
                setImageUrl(imageUrl);
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };
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
    const fecthSchedule = async () => {
        try {
            const response = await fetch(`${baseURL}/user/get-schedule`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setSchedule(data.schedule);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (event) => {
        setIsChange(true);

        const { name, value } = event.target;

        setProfileData({
            ...profileData,
            [name]: value,
        });
        validateField(name, value);
    };

    const handleExtraInfoChange = (event) => {
        const { name, value } = event.target;
        setIsChange(true);
        if (profileData.role == 1) {
            // Tutor
            setProfileData({
                ...profileData,
                Tutor: { ...profileData.Tutor, [name]: value },
            });
        } else if (profileData.role == 2) {
            // Student
            setProfileData({
                ...profileData,
                Student: { ...profileData.Student, [name]: value },
            });
        }
        validateField(name, value);
    };

    const handleSave = async () => {
        if (!isChange) {
            alert("Không có gì thay đổi ");
            return;
        }
        const token = localStorage.getItem("token");
        event.preventDefault();
        const hasErrors = Object.values(errors).some((errorMsg) => errorMsg);
        profileData.subject = selectedSubjectIds;
        profileData.location = selectedAddresses;
        console.log(profileData);
        if (validateForm() && !hasErrors) {
            try {
                const response = await fetch(`${baseURL}/user/send-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: oldEmail,

                        action: "change-profile",
                    }),
                });
                if (response.ok) {
                    navigate("/verify", {
                        state: {
                            data: profileData,

                            action: "change-profile",
                        },
                    });
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.error);
                }
            } catch (error) {
                console.error("Error during sign up", error.message);
            }
        } else {
            setErrorMessage("Vui lòng kiểm tra lại các trường nhập");
        }
    };
    const handleOpenChangePasswordDialog = () => {
        setOpenPasswordDialog(true);
    };

    const handleCloseChangePasswordDialog = () => {
        setOpenPasswordDialog(false);
    };
    const handleChangePassword = async () => {
        // Lấy giá trị mật khẩu mới và mật khẩu xác nhận từ input
        const oldPassword = document.getElementById("old-password").value;
        const newPassword = document.getElementById("new-password").value;
        const confirmNewPassword = document.getElementById(
            "confirm-new-password"
        ).value;

        if (
            !passwordRegex.test(newPassword) ||
            !passwordRegex.test(oldPassword)
        ) {
            alert(
                "Mật khẩu dài từ 8 đến 30 ký tự gồm ít nhất: 1 ký tự đặc biệt, 1 chữ in hoa,1 chữ in thường, 1 số"
            );
            return;
        }
        if (newPassword !== confirmNewPassword) {
            alert("Mật khẩu mới và mã xác nhận mật khẩu không khớp.");
            return;
        }
        const response = await fetch(`${baseURL}/user/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: oldEmail,
                action: "change-password",
            }),
        });
        if (response.ok) {
            navigate("/verify", {
                state: {
                    data: {
                        oldPassword: oldPassword,
                        password: newPassword,
                        retypePassword: confirmNewPassword,
                        email: oldEmail,
                    },

                    action: "change-password",
                },
            });
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.error);
        }
        handleCloseChangePasswordDialog();
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
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Header /> {/* Header component */}
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                bgcolor: "white",
                                p: 4,
                                width: "100%",
                                maxWidth: "100%",
                            }}
                        >
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Box
                                        component="img"
                                        src={imgURL ?? logo}
                                        alt="Profile"
                                        sx={{
                                            width: "100%",
                                            maxWidth: 300,
                                            height: "auto",
                                            objectFit: "contain",
                                            mx: "auto",
                                            mb: { xs: 4, md: 0 },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Họ và tên"
                                        name="name"
                                        variant="outlined"
                                        value={profileData.name}
                                        onChange={handleChange}
                                        margin="normal"
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        type="text"
                                        inputProps={{ maxLength: 50 }}
                                        FormHelperTextProps={{
                                            className: "helper-text",
                                        }}
                                        sx={{
                                            mb: 2,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        variant="outlined"
                                        value={profileData.email}
                                        onChange={handleChange}
                                        margin="normal"
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        type="text"
                                        inputProps={{ maxLength: 255 }}
                                        FormHelperTextProps={{
                                            className: "helper-text",
                                        }}
                                        sx={{
                                            mb: 2,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        name="phoneNumber"
                                        variant="outlined"
                                        value={profileData.phoneNumber}
                                        onChange={handleChange}
                                        margin="normal"
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber}
                                        FormHelperTextProps={{
                                            className: "helper-text",
                                        }}
                                        sx={{
                                            mb: 2,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Age"
                                        name="age"
                                        variant="outlined"
                                        value={profileData.age}
                                        onChange={handleChange}
                                        margin="normal"
                                        type="number"
                                        error={!!errors.age}
                                        helperText={errors.age}
                                        FormHelperTextProps={{
                                            className: "helper-text",
                                        }}
                                        sx={{
                                            mb: 2,
                                        }}
                                    />
                                    <FormControl
                                        component="fieldset"
                                        fullWidth
                                        FormHelperTextProps={{
                                            className: "helper-text",
                                        }}
                                        sx={{ mt: 0.8, mb: 1, minHeight: 60 }}
                                    >
                                        <FormLabel component="legend">
                                            Giới tính
                                        </FormLabel>
                                        <RadioGroup
                                            aria-label="gender"
                                            name="gender"
                                            value={profileData.gender}
                                            onChange={handleChange}
                                            row
                                            sx={{ mb: 0.8 }}
                                        >
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <FormControlLabel
                                                        value={1}
                                                        control={<Radio />}
                                                        label="Nam"
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormControlLabel
                                                        value={2}
                                                        control={<Radio />}
                                                        label="Nữ"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </RadioGroup>
                                    </FormControl>
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
                                                error={!!errors.education}
                                                helperText={errors.education}
                                                FormHelperTextProps={{
                                                    className: "helper-text",
                                                }}
                                                sx={{
                                                    mb: 2,
                                                }}
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
                                                error={!!errors.experience}
                                                helperText={errors.experience}
                                                FormHelperTextProps={{
                                                    className: "helper-text",
                                                }}
                                                sx={{
                                                    mb: 2,
                                                }}
                                            />
                                            <SubjectSelect
                                                allOptions={subjects.data}
                                                selectedOptions={
                                                    selectedSubjectIds
                                                }
                                                onChange={handleSubjectChange}
                                                label={"Môn học"}
                                            />
                                            <SubjectSelect
                                                allOptions={districts}
                                                selectedOptions={
                                                    selectedAddresses
                                                }
                                                onChange={handleLocationChange}
                                                label={"Khu vực"}
                                            />
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
                                            error={!!errors.gradeLevel}
                                            helperText={errors.gradeLevel}
                                            FormHelperTextProps={{
                                                className: "helper-text",
                                            }}
                                            sx={{
                                                mb: 2,
                                            }}
                                        />
                                    )}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center", // Center align buttons horizontally
                                            alignItems: "center", // Align buttons vertically
                                            mt: 2, // Margin top
                                        }}
                                    >
                                        <Button
                                            disabled={profileData.role == 0}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSave}
                                            sx={{ mx: 2 }} // Horizontal margin
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={
                                                handleOpenChangePasswordDialog
                                            }
                                            sx={{ ml: { xs: 8, md: 4 } }}
                                        >
                                            Đổi mật khẩu
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>

                            {schedule && (
                                <Schedule data={schedule} role={role} />
                            )}
                        </Box>
                        <Dialog
                            open={openPasswordDialog}
                            onClose={handleCloseChangePasswordDialog}
                        >
                            <DialogTitle>Đổi Mật Khẩu</DialogTitle>

                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="old-password"
                                    label="Mật khẩu cũ"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                />
                                <TextField
                                    margin="dense"
                                    id="new-password"
                                    label="Mật khẩu mới"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                />
                                <TextField
                                    margin="dense"
                                    id="confirm-new-password"
                                    label="Nhập lại mật khẩu mới"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={handleCloseChangePasswordDialog}
                                >
                                    Hủy
                                </Button>
                                <Button onClick={handleChangePassword}>
                                    Xác nhận
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Container>
                </Box>
            </Container>
            <Footer />
        </React.Fragment>
    );
}
