import React, { useEffect, useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box, Container, Grid, MenuItem, Popover } from "@mui/material";
import { useNavigate } from "react-router-dom";
function Header() {
    const logoStyle = {
        width: "60px",
        height: "60px",
        cursor: "pointer",
        borderRadius: "50%",
    };
    const [name, setName] = useState(null);
    const subjects = ["Toan", "Ly", "Hoa", "Sinh"];
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [anchorElCourse, setAnchorElCourse] = useState(null);
    const [anchorElProfile, setAnchorElProfile] = useState(null);
    const navigate = useNavigate();
    const popoverHoverCourseRef = useRef(false);
    const popoverHoverProfileRef = useRef(false);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            setName(localStorage.getItem("name"));
        }
    }, [isLoggedIn]);
    const handLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        setIsLoggedIn(null);
        handleNavigate("");
    };
    const handleNavigate = (page) => {
        navigate(`/${page}`);
    };
    const handlePopoverCourseOpen = (event) => {
        clearTimeout(popoverHoverCourseRef.current);
        setAnchorElCourse(event.currentTarget);
    };
    const handlePopoverCourseHover = () => {
        clearTimeout(popoverHoverCourseRef.current);
    };
    const handlePopoverCourseClose = () => {
        popoverHoverCourseRef.current = setTimeout(() => {
            setAnchorElCourse(null);
        }, 100);
    };

    const handlePopoverProfileOpen = (event) => {
        clearTimeout(popoverHoverProfileRef.current);
        setAnchorElProfile(event.currentTarget);
    };

    const handlePopoverProfileClose = () => {
        popoverHoverProfileRef.current = setTimeout(() => {
            setAnchorElProfile(null);
        }, 100);
    };

    const handlePopoverProfileHover = () => {
        clearTimeout(popoverHoverProfileRef.current);
    };
    const openCourse = Boolean(anchorElCourse);
    const openProfile = Boolean(anchorElProfile);
    return (
        <AppBar
            position="fixed"
            sx={{
                boxShadow: 0,
                bgcolor: "transparent",
                backgroundImage: "none",
                mt: 2,
            }}
        >
            <Container maxWidth="lg">
                <Toolbar
                    variant="regular"
                    sx={(theme) => ({
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexShrink: 0,
                        borderRadius: "999px",
                        bgcolor:
                            theme.palette.mode === "light"
                                ? "rgba(255, 255, 255, 0.4)"
                                : "rgba(0, 0, 0, 0.4)",
                        backdropFilter: "blur(24px)",
                        maxHeight: 40,
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow:
                            theme.palette.mode === "light"
                                ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
                    })}
                >
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            alignItems: "center",
                            ml: "-18px",
                            px: 0,
                        }}
                        onClick={() => handleNavigate("")}
                    >
                        <img
                            src={
                                "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/347820247_1280945992539999_1915767725978544383_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeG9WnlvddTwVIZQBJvTZZKSv8KNred9PqO_wo2t530-o-UCb7rs6BcphFIw9tR17U3sDPQrrEtmJfejr6NwQy_N&_nc_ohc=GGI0csNRligQ7kNvgHFsClZ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYDGf7mU1fpLTqVF-gqbwAL--Lavwq9Mo6NPiCb0St1ONQ&oe=664FF7F2"
                            }
                            style={logoStyle}
                            alt="logo of sitemark"
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "flex" },
                                fontWeight: 700,
                                color: "primary",
                                textDecoration: "none",
                                flexGrow: 1,
                            }}
                        >
                            <Button
                                sx={{
                                    color: "#2291ff",
                                    fontWeight: "bold",
                                }}
                            >
                                Introducing Tutor
                            </Button>
                        </Typography>
                    </Box>

                    <Button color="primary" onClick={() => handleNavigate("")}>
                        Trang chủ{" "}
                    </Button>
                    <Button color="primary">Gia sư </Button>
                    <Button
                        color="primary"
                        size="large"
                        aria-controls={openCourse ? "courses-menu" : undefined}
                        aria-haspopup="true"
                        onMouseEnter={handlePopoverCourseOpen}
                        onMouseLeave={handlePopoverCourseClose}
                    >
                        Khóa học
                    </Button>
                    <Popover
                        id="courses-menu"
                        open={openCourse}
                        anchorEl={anchorElCourse}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        sx={{
                            mt: 1,
                            zIndex: 1000,
                            alignItems: "center",
                            justifyContent: "center",
                            borderColor: "divider",
                        }}
                        onClose={handlePopoverCourseClose}
                        disableRestoreFocus
                    >
                        <Grid
                            container
                            spacing={1}
                            sx={{
                                minWidth: 240,
                                minHeight: 60,
                                borderColor: "divider",
                            }}
                            alignItems="center"
                        >
                            {subjects.map((item, index) => (
                                <Grid item xs={4} key={index}>
                                    <MenuItem
                                        color="primary"
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            mr: 2,
                                            minWidth: 60,
                                            minHeight: 60,
                                        }}
                                        onMouseEnter={handlePopoverCourseHover}
                                        onMouseLeave={handlePopoverCourseClose}
                                    >
                                        {item}
                                    </MenuItem>
                                </Grid>
                            ))}
                        </Grid>
                    </Popover>

                    {isLoggedIn ? (
                        <Button
                            color="primary"
                            size="large"
                            aria-controls={
                                openProfile ? "profile-menu" : undefined
                            }
                            sx={{ mr: 6 }}
                            aria-haspopup="true"
                            onMouseEnter={handlePopoverProfileOpen}
                            onMouseLeave={handlePopoverProfileClose}
                        >
                            {name}
                        </Button>
                    ) : (
                        <Grid>
                            <Button
                                color="primary"
                                onClick={() => handleNavigate("login")}
                            >
                                Login
                            </Button>{" "}
                            <Button
                                color="primary"
                                sx={{ mr: 6 }}
                                onClick={() => handleNavigate("sign-up")}
                            >
                                Sign Up
                            </Button>
                        </Grid>
                    )}
                    <Popover
                        id="profile-menu"
                        open={openProfile}
                        anchorEl={anchorElProfile}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        sx={{
                            mt: 1,
                            zIndex: 1000,
                            alignItems: "center",
                            justifyContent: "center",

                            borderColor: "divider",
                        }}
                        onClose={handlePopoverProfileClose}
                        disableRestoreFocus
                    >
                        <Grid
                            container
                            spacing={1}
                            sx={{
                                minWidth: 240,
                                minHeight: 60,
                                borderColor: "divider",
                            }}
                            alignItems="center"
                        >
                            <Grid item xs={6}>
                                <MenuItem
                                    color="primary"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mr: 2,
                                        minWidth: 60,
                                        minHeight: 60,
                                    }}
                                    onMouseEnter={handlePopoverProfileHover}
                                    onMouseLeave={handlePopoverProfileClose}
                                >
                                    Tài khoản
                                </MenuItem>
                            </Grid>
                            <Grid item xs={6}>
                                <MenuItem
                                    color="primary"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mr: 2,
                                        minWidth: 60,
                                        minHeight: 60,
                                    }}
                                    onMouseEnter={handlePopoverProfileHover}
                                    onMouseLeave={handlePopoverProfileClose}
                                    onClick={handLogout}
                                >
                                    Đăng xuất
                                </MenuItem>
                            </Grid>
                        </Grid>
                    </Popover>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;
