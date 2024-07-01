import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../components/header";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import logo from "../../public/image/Logo_STU.png";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignInSide() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [token, setToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState({ username: false, password: false });
    const [helperText, setHelperText] = useState({
        username: "",
        password: "",
    });

    const validateForm = () => {
        let isValid = true;
        setError({ username: false, password: false });
        setHelperText({ username: "", password: "" });

        // Simple validation logic (can be replaced with more complex logic)
        if (!formData.username || formData.username.length < 8) {
            setError((prevState) => ({ ...prevState, username: true }));
            setHelperText((prevState) => ({
                ...prevState,
                username: "Invalid username",
            }));
            isValid = false;
        }
        if (!formData.password) {
            setError((prevState) => ({ ...prevState, password: true }));
            setHelperText((prevState) => ({
                ...prevState,
                password: "Invalid password",
            }));
            isValid = false;
        }
        return isValid;
    };
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch(
                    "http://localhost:5999/v1/api/user/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setToken(data.data.token);
                    localStorage.setItem("token", data.data.token);
                    localStorage.setItem("name", data.data.name);
                    localStorage.setItem("role", data.data.role);
                    console.log(data.data);
                    if (data.data.role == 0) {
                        handleNavigate("dashboard/users");
                    } else handleNavigate("");
                } else {
                    const errorData = await response.json();

                    setErrorMessage(errorData.error);
                }
            } catch (error) {
                console.error("Error during login", error.message);
                setErrorMessage("Internal Server Error");
            }
        }
    };
    const handleNavigate = (page) => {
        navigate(`/${page}`);
    };
    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: "100vh" }}>
                <CssBaseline />
                <Header />

                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${logo})`,
                        backgroundRepeat: "no-repeat",
                        backgroundColor: (t) =>
                            t.palette.mode === "light"
                                ? t.palette.grey[50]
                                : t.palette.grey[900],
                        backgroundSize: "container",
                        backgroundPosition: "center",
                    }}
                />
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mt: 12,
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                error={error.username}
                                helperText={helperText.username}
                                autoFocus
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                error={error.password}
                                helperText={helperText.password}
                                onChange={handleInputChange}
                            />
                            {errorMessage && (
                                <Typography
                                    variant="body2"
                                    color="error"
                                    align="center"
                                >
                                    {errorMessage}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/sign-up" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Footer />
            </Grid>
        </ThemeProvider>
    );
}
