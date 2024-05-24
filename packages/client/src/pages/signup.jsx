import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";

import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FormControl, FormLabel, Radio, RadioGroup } from "@mui/material";
import Header from "../components/header";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
    const navigate = useNavigate();
    const [value, setValue] = useState(1);
    const [errorMessage, setErrorMessage] = useState(null);
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        password: "",
        email: "",
        phoneNumber: "",
        role: 1,
        educationLevel: {
            education: "",
            experience: "",
        },
    });
    // Function to check if an email is valid
    const isEmailValid = (email) => {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Basic email regex check
        return emailRegex.test(email);
    };
    const isPasswordValid = (password) => {
        const passwordRegex =
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[-`~!@#$%^&*()_+={}[\\]|\:\;\"\'\<\>\,\.?\/]).{8,30}$/;
        return passwordRegex.test(password);
    };

    // Function to check if a phone number is valid
    const isPhoneValid = (phone) => {
        const phoneRegex = /^(0[1-9][0-9]{8}|\+84[1-9][0-9]{8})$/; // Basic phone regex check, adjust depending on your criteria
        return phoneRegex.test(phone);
    };

    // Updated useState hook to include errors for each field
    const [errors, setErrors] = useState({
        fullname: "",
        username: "",
        password: "",
        email: "",
        phoneNumber: "",
        education: "",
        experience: "",
        gradelLevel: "",
    });

    // Whenever handleChange is called, validate the specific field and update the error state
    const validateField = (name, value) => {
        let errorMsg = "";
        switch (name) {
            case "fullname":
                errorMsg = value ? "" : "Họ và Tên không được để trống";
                break;
            case "username":
                errorMsg =
                    value && value.length > 7 && value.length < 31
                        ? ""
                        : "Tài khoản dài từ 8 đến 30 ký tự";
                break;
            case "password":
                errorMsg = isPasswordValid(value)
                    ? ""
                    : "Mật khẩu dài từ 8 đến 30 ký tự gồm ít nhất: 1 ký tự đặc biệt, 1 chữ in hoa,1 chữ in thường, 1 số";
                break;
            case "email":
                errorMsg = isEmailValid(value)
                    ? ""
                    : "Email không đúng định dạng ";
                break;
            case "phoneNumber":
                errorMsg = isPhoneValid(value)
                    ? ""
                    : "Số điện thoại không đúng định dạng";
                break;
            case "education":
                errorMsg = value ? "" : "Trình độ không được để trống";
                break;
            case "experience":
                errorMsg = value ? "" : "Kinh nghiệm không được để trống";
                break;
            case "gradelLevel":
                errorMsg = value ? "" : "Lớp không được để trống";
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name == "role") {
            setValue(value);
            setFormData((prevData) => ({
                ...prevData,
                role: value,
                educationLevel:
                    value == 1
                        ? { education: "", experience: "" }
                        : { gradelLevel: "" },
            }));
        } else if (name in formData.educationLevel) {
            setFormData((prevData) => ({
                ...prevData,
                educationLevel: {
                    ...prevData.educationLevel,
                    [name]: value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }

        validateField(name, value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //    console.log(1);
        const hasErrors = Object.values(errors).some((errorMsg) => errorMsg);
        if (!hasErrors) {
            try {
                const response = await fetch(
                    "http://localhost:5999/v1/api/user/send-otp",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: formData.username,
                            email: formData.email,
                            action: "sign-up",
                        }),
                    }
                );
                if (response.ok) {
                    navigate("/verify", {
                        state: {
                            data: formData,
                            action: "sign-up",
                        },
                    });
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.error);
                }
            } catch (error) {
                console.error("Error during login", error.message);
            }
        } else {
            setErrorMessage(hasErrors);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
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
                        onSubmit={handleSubmit}
                        sx={{ mt: 4 }}
                    >
                        {errorMessage && (
                            <Typography
                                variant="body2"
                                color="error"
                                align="center"
                            >
                                {errorMessage}
                            </Typography>
                        )}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="fullname"
                                    required
                                    fullWidth
                                    id="fullname"
                                    label="Họ và tên"
                                    error={!!errors.fullname}
                                    helperText={errors.fullname}
                                    autoFocus
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="username"
                                    label="Tài khoản"
                                    type="username"
                                    id="username"
                                    error={!!errors.username}
                                    helperText={errors.username}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="phoneNumber"
                                    label="Số điện thoại"
                                    name="phoneNumber"
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl component="fieldset" fullWidth>
                                    <FormLabel component="legend">
                                        Vai trò
                                    </FormLabel>
                                    <RadioGroup
                                        aria-label="role"
                                        name="role"
                                        value={value}
                                        onChange={handleChange}
                                        row
                                    >
                                        {/* Sử dụng Grid container với spacing để tạo khoảng cách giữa các item */}
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    value={1}
                                                    control={<Radio />}
                                                    label="Gia sư"
                                                    style={{
                                                        justifyContent:
                                                            "center",
                                                        display: "flex",
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    value={2}
                                                    control={<Radio />}
                                                    label="Học sinh"
                                                    style={{
                                                        justifyContent:
                                                            "center",
                                                        display: "flex",
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            {value == 1 ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="education"
                                            label="Trình độ "
                                            name="education"
                                            error={!!errors.education}
                                            helperText={errors.education}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="experience"
                                            label="Kinh nghiệm"
                                            name="experience"
                                            error={!!errors.experience}
                                            helperText={errors.experience}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="gradelLevel"
                                            label="Lớp"
                                            name="gradelLevel"
                                            error={!!errors.gradelLevel}
                                            helperText={errors.gradelLevel}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <Footer />
        </ThemeProvider>
    );
}
