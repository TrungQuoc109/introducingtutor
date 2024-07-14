import React, { useState } from "react";
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
} from "@mui/material";
import Header from "../components/header";
import Footer from "../components/footer";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider } from "@emotion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL, firebaseConfig } from "../config/config";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
const defaultTheme = createTheme();
function VerifyPage() {
    const navigate = useNavigate();
    const [otpCode, setOtpcode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const location = useLocation();
    const { action, data, img, file } = location.state ?? {};
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    const uploadImage = async (imageFile, id) => {
        if (!imageFile) {
            throw new Error("No image file specified.");
        }

        const storage = getStorage(app);

        const fileRef = ref(storage, `avatar/${id}`);
        try {
            const snapshot = await uploadBytes(fileRef, file);

            console.log("Uploaded a blob or file!", snapshot);
        } catch (error) {
            console.error("Error during file upload:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${baseURL}/user/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    data: data,
                    verify: {
                        email: data.email,
                        otpCode: otpCode,
                    },
                }),
            });

            if (response.ok || response.status < 400) {
                if (action == "sign-up") {
                    const data = await response.json();

                    uploadImage(img, data.data.userId);
                }
                navigate("/");
            } else {
                const errorData = await response.json();

                if (action === "change-profile") {
                    navigate("/profile");
                } else if (action === "change-password") {
                    alert("Mật khẩu cũ không đúng");

                    navigate("/profile");
                } else {
                    navigate(`/${action}`, {
                        state: {
                            data: data,
                        },
                    });
                }

                setErrorMessage(errorData.error);
            }
        } catch (error) {
            console.error("Error during login", error.message);
            setErrorMessage("Internal Server Error");
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
                        height: "82vh",
                        pt: 10,
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main", mt: 12 }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Mã xác thực
                    </Typography>

                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 4 }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="otpCode"
                                    required
                                    fullWidth
                                    id="otpCode"
                                    label="Mã xác thực"
                                    autoFocus
                                    onChange={(event) => {
                                        setOtpcode(event.target.value);
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            xác thực
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Button variant="text">
                                    Gửi lại mã xác thực
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

export default VerifyPage;
