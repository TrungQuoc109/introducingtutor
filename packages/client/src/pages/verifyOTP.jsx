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
import { useLocation } from "react-router-dom";
const defaultTheme = createTheme();
function VerifyPage() {
    const [otpCode, setOtpcode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const location = useLocation();
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const { action, data } = location.state ?? {};
            console.log(action, data);
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
                        height: "71.8vh",
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
