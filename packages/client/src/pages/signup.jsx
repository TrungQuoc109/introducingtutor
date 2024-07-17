import React, { useContext, useState } from "react";
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControl,
    FormLabel,
    Radio,
    RadioGroup,
    Grid,
    Box,
    Typography,
    Container,
    Checkbox,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Link,
    FormControlLabel,
    FormHelperText,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { RxAvatar } from "react-icons/rx";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Header from "../components/header";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../dataprovider/subject.jsx";
import { baseURL, districts } from "../config/config.js";

const defaultTheme = createTheme();

export default function SignUp() {
    const navigate = useNavigate();
    const [value, setValue] = useState(1);
    const [errorMessage, setErrorMessage] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        email: "",
        age: "",
        phoneNumber: "",
        role: 1,
        educationLevel: {
            education: "",
            experience: "",
        },
        subjects: [],
        address: [],
    });
    const [errors, setErrors] = useState({});
    const options = useContext(DataContext);
    const [imageUrl, setImageUrl] = useState("");
    const [image, setImage] = useState(null);
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex =
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-`~!@#$%^&*()_+={}[\\]|\:\;\"\'\<\>\,\.?\/]).{8,30}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,30}$/;
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
            case "username":
                errorMsg = usernameRegex.test(value)
                    ? ""
                    : "Tài khoản dài từ 8 đến 30 ký tự";
                break;
            case "password":
                errorMsg = passwordRegex.test(value)
                    ? ""
                    : "Mật khẩu dài từ 8 đến 30 ký tự gồm ít nhất: 1 ký tự đặc biệt, 1 chữ in hoa,1 chữ in thường, 1 số";
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
                        : "Tuổi không hợp lệ";
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
    };
    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra các trường cơ bản
        if (!formData.name) newErrors.name = "Họ và Tên không được để trống";
        if (!formData.username || !usernameRegex.test(formData.username)) {
            newErrors.username = "Tài khoản dài từ 8 đến 30 ký tự";
        }
        if (!formData.password || !passwordRegex.test(formData.password)) {
            newErrors.password =
                "Mật khẩu dài từ 8 đến 30 ký tự gồm ít nhất: 1 ký tự đặc biệt, 1 chữ in hoa,1 chữ in thường, 1 số";
        }
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = "Email không đúng định dạng";
        }
        if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại không đúng định dạng";
        }
        if (
            isNaN(formData.age) ||
            parseInt(Number(formData.age)) != formData.age ||
            formData.age < 3 ||
            formData.age > 65
        ) {
            newErrors.age = "Tuổi không hợp lệ";
        }
        if (formData.role == 1) {
            if (!formData.educationLevel.education)
                newErrors.education = "Trình độ không được để trống";
            if (!formData.educationLevel.experience)
                newErrors.experience = "Kinh nghiệm không được để trống";
            if (!formData.subjects.length) {
                newErrors.subjects = "Bạn phải chọn ít nhất một môn học";
            }
            if (!formData.address.length) {
                newErrors.address = "Bạn phải chọn ít nhất một địa chỉ";
            }
        } else if (formData.role == 2) {
            if (!formData.educationLevel.gradeLevel)
                newErrors.gradeLevel = "Lớp không được để trống";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => {
            if (name in prevData.educationLevel) {
                return {
                    ...prevData,
                    educationLevel: {
                        ...prevData.educationLevel,
                        [name]: value,
                    },
                };
            }
            return { ...prevData, [name]: value };
        });

        validateField(name, value);
    };

    const handleChangeRole = (event) => {
        const value = parseInt(event.target.value, 10);
        setValue(value);
        setFormData((prevData) => ({
            ...prevData,
            role: value,
            educationLevel:
                value == 1
                    ? { education: "", experience: "" }
                    : { gradeLevel: "" },
        }));
    };

    const handleChangeSubject = (event) => {
        const selectedValues = event.target.value;
        const selectedSubjects = selectedValues.map((name) => {
            return options.data.find((option) => option.name === name);
        });

        setFormData((prevData) => ({
            ...prevData,
            subjects: selectedSubjects,
        }));
        if (formData.subjects.length != 0) {
            errors.subjects = "";
            setErrors(errors);
        }
    };
    const handleChangeDistrict = (event) => {
        const selectedValues = event.target.value;
        const selectedDistricts = selectedValues.map((name) => {
            return districts.find((district) => district.name === name);
        });

        setFormData((prevData) => ({
            ...prevData,
            address: selectedDistricts,
        }));

        if (formData.address.length != 0) {
            errors.address = "";
            setErrors(errors);
        }
    };
    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const imgURL = URL.createObjectURL(event.target.files[0]);
            console.log("a:", imageUrl);
            setImageUrl(imgURL);
            setImage(event.target.files[0]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const hasErrors = Object.values(errors).some((errorMsg) => errorMsg);
        console.log(formData);
        if (validateForm() && !hasErrors) {
            try {
                const response = await fetch(`${baseURL}/user/send-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        phoneNumber: formData.phoneNumber,
                        action: "sign-up",
                    }),
                });
                if (response.ok) {
                    const data = await response.json();

                    navigate("/verify", {
                        state: {
                            data: formData,
                            otp: data.data.otp,
                            action: "sign-up",
                            img: imageUrl,
                            file: image,
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

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Header />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main", mt: 12 }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>

                    <Box
                        component="form"
                        noValidate
                        minWidth={"100%"}
                        onSubmit={handleSubmit}
                        FormHelperTextProps={{ className: "helper-text" }}
                        sx={{ mb: 4, minHeight: 60 }}
                    >
                        {" "}
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "24vh",
                                            height: "24vh",
                                            objectFit: "cover",
                                            mb: 4,
                                        }}
                                    >
                                        {imageUrl ? (
                                            <Box
                                                component="img"
                                                src={imageUrl}
                                                alt="Uploaded image"
                                                sx={{
                                                    width: "24vh",
                                                    height: "24vh",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            <RxAvatar fontSize={"24vh"} />
                                        )}
                                    </Box>
                                    <input
                                        accept="image/*"
                                        id="contained-button-file"
                                        multiple
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button
                                            variant="contained"
                                            component="span"
                                        >
                                            Tải lên ảnh
                                        </Button>
                                    </label>
                                </Box>
                                <TextField
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Họ và tên"
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    autoFocus
                                    type="text"
                                    inputProps={{ maxLength: 50 }}
                                    onChange={handleChange}
                                    FormHelperTextProps={{
                                        className: "helper-text",
                                    }}
                                    sx={{ mt: 2, mb: 4, position: "relative" }}
                                />

                                <TextField
                                    required
                                    fullWidth
                                    id="age"
                                    label="Tuổi"
                                    name="age"
                                    type="number"
                                    error={!!errors.age}
                                    helperText={errors.age}
                                    onChange={handleChange}
                                    FormHelperTextProps={{
                                        className: "helper-text",
                                    }}
                                    sx={{ mb: 4, minHeight: 60 }}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    type="text"
                                    inputProps={{ maxLength: 255 }}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    onChange={handleChange}
                                    FormHelperTextProps={{
                                        className: "helper-text",
                                    }}
                                    sx={{ mb: 4, minHeight: 60 }}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    id="phoneNumber"
                                    label="Số điện thoại"
                                    name="phoneNumber"
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber}
                                    onChange={handleChange}
                                    FormHelperTextProps={{
                                        className: "helper-text",
                                    }}
                                    sx={{ mb: 4, minHeight: 60 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="username"
                                    label="Tài khoản"
                                    id="username"
                                    type="text"
                                    inputProps={{ maxLength: 30 }}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                    onChange={handleChange}
                                    FormHelperTextProps={{
                                        className: "helper-text",
                                    }}
                                    sx={{ mt: 4, mb: 4, position: "relative" }}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    inputProps={{ maxLength: 30 }}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    onChange={handleChange}
                                    FormHelperTextProps={{
                                        className: "helper-text-password",
                                    }}
                                    sx={{ mb: 4, minHeight: 70 }}
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
                                        Vai trò
                                    </FormLabel>
                                    <RadioGroup
                                        aria-label="role"
                                        name="role"
                                        value={value}
                                        onChange={handleChangeRole}
                                        row
                                        sx={{ mb: 0.8 }}
                                    >
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    value={1}
                                                    control={<Radio />}
                                                    label="Gia sư"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    value={2}
                                                    control={<Radio />}
                                                    label="Học sinh"
                                                />
                                            </Grid>
                                        </Grid>
                                    </RadioGroup>
                                </FormControl>
                                {formData.role == 1 && (
                                    <>
                                        <TextField
                                            required
                                            fullWidth
                                            id="education"
                                            label="Trình độ học vấn"
                                            name="education"
                                            error={!!errors.education}
                                            helperText={errors.education}
                                            type="text"
                                            inputProps={{ maxLength: 50 }}
                                            onChange={handleChange}
                                            FormHelperTextProps={{
                                                className: "helper-text",
                                            }}
                                            sx={{ mb: 3.6, minHeight: 60 }}
                                        />
                                        <TextField
                                            required
                                            fullWidth
                                            id="experience"
                                            label="Kinh nghiệm làm việc"
                                            name="experience"
                                            error={!!errors.experience}
                                            helperText={errors.experience}
                                            type="text"
                                            inputProps={{ maxLength: 255 }}
                                            onChange={handleChange}
                                            FormHelperTextProps={{
                                                className: "helper-text",
                                            }}
                                            sx={{ mb: 4, minHeight: 60 }}
                                        />
                                        <FormControl sx={{ width: "100%" }}>
                                            <InputLabel id="subject">
                                                Môn học
                                            </InputLabel>
                                            <Select
                                                labelId="subject"
                                                id="subject"
                                                multiple
                                                value={formData.subjects.map(
                                                    (subject) => subject.name
                                                )}
                                                onChange={handleChangeSubject}
                                                renderValue={(selected) =>
                                                    selected.join(", ")
                                                }
                                                error={!!errors.subjects}
                                                helperText={errors.subjects}
                                                label="Môn học"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                        },
                                                    },
                                                }}
                                            >
                                                {options &&
                                                    options.data.map(
                                                        (option) => (
                                                            <MenuItem
                                                                key={option.id}
                                                                value={
                                                                    option.name
                                                                }
                                                                sx={{
                                                                    height: "32px",
                                                                    fontSize:
                                                                        "16px",
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    checked={
                                                                        formData.subjects
                                                                            .map(
                                                                                (
                                                                                    subject
                                                                                ) =>
                                                                                    subject.name
                                                                            )
                                                                            .indexOf(
                                                                                option.name
                                                                            ) >
                                                                        -1
                                                                    }
                                                                />
                                                                <ListItemText
                                                                    primary={
                                                                        option.name
                                                                    }
                                                                />
                                                            </MenuItem>
                                                        )
                                                    )}
                                            </Select>{" "}
                                            {errors.subjects ? (
                                                <FormHelperText
                                                    sx={{
                                                        color: "red ",
                                                        minHeight: 30,
                                                    }}
                                                >
                                                    {errors.subjects}
                                                </FormHelperText>
                                            ) : (
                                                // Khi không có lỗi, vẫn giữ một khoảng không tương tự để tránh thay đổi layout
                                                <FormHelperText
                                                    sx={{
                                                        visibility: "hidden",
                                                        minHeight: 30,
                                                    }}
                                                >
                                                    Placeholder
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl
                                            sx={{
                                                width: "100%",
                                                mt: 0.4,
                                            }}
                                        >
                                            <InputLabel id="district">
                                                Khu vực dạy
                                            </InputLabel>
                                            <Select
                                                labelId="district"
                                                id="district-select"
                                                multiple
                                                onChange={handleChangeDistrict}
                                                value={formData.address.map(
                                                    (add) => add.name
                                                )}
                                                renderValue={(selected) =>
                                                    selected.join(", ")
                                                }
                                                error={!!errors.address}
                                                helperText={errors.address}
                                                label="Khu vực dạy"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                        },
                                                    },
                                                }}
                                            >
                                                {districts &&
                                                    districts.map((option) => (
                                                        <MenuItem
                                                            key={option.id}
                                                            value={option.name}
                                                            sx={{
                                                                height: "32px",
                                                                fontSize:
                                                                    "16px",
                                                            }}
                                                        >
                                                            <Checkbox
                                                                checked={
                                                                    formData.address
                                                                        .map(
                                                                            (
                                                                                add
                                                                            ) =>
                                                                                add.name
                                                                        )
                                                                        .indexOf(
                                                                            option.name
                                                                        ) > -1
                                                                }
                                                            />
                                                            <ListItemText
                                                                primary={
                                                                    option.name
                                                                }
                                                            />
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                            {errors.address && (
                                                <FormHelperText
                                                    sx={{ color: "red " }}
                                                >
                                                    {errors.address}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </>
                                )}
                                {formData.role == 2 && (
                                    <TextField
                                        required
                                        fullWidth
                                        id="gradeLevel"
                                        label="Lớp"
                                        name="gradeLevel"
                                        error={!!errors.gradeLevel}
                                        helperText={errors.gradeLevel}
                                        onChange={handleChange}
                                        FormHelperTextProps={{
                                            className: "helper-text",
                                        }}
                                        sx={{ mb: 4, minHeight: 60 }}
                                    />
                                )}
                            </Grid>
                        </Grid>
                        {errorMessage && (
                            <Typography
                                variant="body2"
                                color="error"
                                align="center"
                            >
                                {errorMessage}
                            </Typography>
                        )}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 4 }}
                            >
                                Đăng ký
                            </Button>
                        </Box>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Button
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                    variant="text"
                                >
                                    Bạn đã có tài khoản? Đăng nhập
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <Footer />
        </ThemeProvider>
    );
}
