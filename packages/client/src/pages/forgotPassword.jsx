import React, { useEffect, useState } from "react";
import {
    Container,
    Box,
    CssBaseline,
    Button,
    Grid,
    Avatar,
    Typography,
    TextField,
    createTheme,
    Slide,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { ThemeProvider } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../config/config";
import Header from "../components/header";
import Footer from "../components/footer";

const defaultTheme = createTheme();

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [timer, setTimer] = useState(0);
    const [showInput, setShowInput] = useState(false);

    // Khai báo trạng thái mới để lưu thông điệp lỗi
    const [errors, setErrors] = useState({
        email: "",

        newPassword: "",
        retypePassword: "",
    });
    const validateEmail = (email) => {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegex.test(email);
    };
    const validateForm = () => {
        let tempErrors = {
            email: "",

            newPassword: "",
            retypePassword: "",
        };
        let isValid = true;

        if (!validateEmail(email)) {
            tempErrors.email = "Email không hợp lệ.";
            isValid = false;
        }

        if (newPassword.length < 6) {
            tempErrors.newPassword = "Mật khẩu phải dài hơn 6 ký tự.";
            isValid = false;
        }
        if (newPassword !== retypePassword) {
            tempErrors.retypePassword = "Nhập lại mật khẩu không khớp.";
            isValid = false;
        }

        setErrors({ ...tempErrors });
        return isValid;
    };
    // Hàm xử lý gửi mã OTP (ví dụ)
    const handleSendOtp = async () => {
        try {
            if (!validateEmail(email)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: "Email không hợp lệ.",
                }));
            } else {
                const response = await fetch(`${baseURL}/user/send-otp`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });
                const data = await response.json();
                if (response.ok) {
                    setShowInput(true); // Show the input fields
                    setIsDisabled(true);
                    setTimer(10);
                    setErrorMessage("");
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: "",
                    }));
                } else {
                    setShowInput(false);
                    setErrorMessage(data.error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (validateForm()) {
                const response = await fetch(
                    `${baseURL}/user/forgot-password`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            data: { newPassword, retypePassword },
                            verify: {
                                email: email,
                                otpCode: otpCode,
                            },
                        }),
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    navigate("/login");
                } else {
                    setErrorMessage(data.error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        let interval = null;
        if (isDisabled && timer > 0) {
            interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsDisabled(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isDisabled, timer]);
    return (
        <ThemeProvider theme={defaultTheme}>
            <Header />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "82vh",
                        pt: 12,
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockResetIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Khôi phục mật khẩu
                    </Typography>
                    <Box
                        fullWidth
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                        />

                        <Slide
                            direction="up"
                            in={showInput}
                            mountOnEnter
                            unmountOnExit
                        >
                            <Box>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    inputProps={{ maxLength: 30 }}
                                    name="newPassword"
                                    label="Mật khẩu mới"
                                    type="password"
                                    id="newPassword"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    error={!!errors.newPassword}
                                    helperText={errors.newPassword}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="retypePassword"
                                    inputProps={{ maxLength: 30 }}
                                    label="Nhập lại mật khẩu mới"
                                    type="password"
                                    id="retypePassword"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setRetypePassword(e.target.value)
                                    }
                                    error={!!errors.retypePassword}
                                    helperText={errors.retypePassword}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="otpCode"
                                    label="Mã OTP"
                                    type="number"
                                    id="otpCode"
                                    autoComplete="otp-code"
                                    onChange={(e) => setOtpCode(e.target.value)}
                                />
                            </Box>
                        </Slide>
                        {errorMessage && (
                            <Typography
                                fullWidth
                                color="error"
                                variant="body2"
                                sx={{ mt: 2 }}
                            >
                                {errorMessage}
                            </Typography>
                        )}
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3 }}
                            onClick={handleSendOtp}
                            disabled={isDisabled}
                        >
                            {isDisabled
                                ? ` Gửi lại sau ${timer} giây`
                                : "Gửi mã OTP"}
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Xác thực
                        </Button>
                    </Box>
                </Box>
            </Container>
            <Footer />
        </ThemeProvider>
    );
}

export default ForgotPasswordPage;
