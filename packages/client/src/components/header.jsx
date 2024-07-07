import React, { useContext, useEffect, useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import {
    Box,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    Popover,
    Drawer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../public/image/Logo_STU.png";
import { RxAvatar } from "react-icons/rx";

function Header() {
    const logoStyle = {
        width: "60px",
        height: "60px",
        cursor: "pointer",
        borderRadius: "50%",
    };
    const [name, setName] = useState(null);
    const [role, setRole] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [anchorElProfile, setAnchorElProfile] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const popoverHoverProfileRef = useRef(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            const fullname = localStorage.getItem("name");
            const temp = fullname.split(" ").at(-1);

            setName(temp);

            setRole(localStorage.getItem("role"));
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        setIsLoggedIn(null);
        handleNavigate("");
    };

    const handleNavigate = (page) => {
        navigate(`/${page}`);
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

    const toggleDrawer = (open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setDrawerOpen(open);
    };

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
                            src={logo}
                            style={logoStyle}
                            alt="logo of sitemark"
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
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
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                        }}
                    >
                        <Button
                            color="primary"
                            onClick={() => handleNavigate("")}
                        >
                            Trang chủ{" "}
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => handleNavigate("tutor")}
                        >
                            Gia sư{" "}
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => handleNavigate("course")}
                        >
                            Khóa học
                        </Button>
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
                                <RxAvatar
                                    fontSize={40}
                                    style={{ marginRight: 8 }}
                                />

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
                    </Box>
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            color="black"
                            edge="end"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <Popover
                        id="profile-menu"
                        open={openProfile}
                        anchorEl={anchorElProfile}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
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
                                borderColor: "divider",
                            }}
                            alignItems="center"
                        >
                            <List disablePadding>
                                <ListItem
                                    component="button"
                                    color="primary"
                                    onMouseEnter={handlePopoverProfileHover}
                                    onMouseLeave={handlePopoverProfileClose}
                                    onClick={() => {
                                        handleNavigate("profile");
                                    }}
                                    sx={{
                                        justifyContent: "center",
                                        mt: 1,
                                        minWidth: 60,
                                        minHeight: 40,
                                    }}
                                >
                                    Tài khoản
                                </ListItem>

                                <ListItem
                                    component="button"
                                    color="primary"
                                    onMouseEnter={handlePopoverProfileHover}
                                    onMouseLeave={handlePopoverProfileClose}
                                    onClick={() => {
                                        if (role == 0)
                                            handleNavigate("dashboard/users");
                                        else handleNavigate("my-course");
                                    }}
                                    sx={{
                                        justifyContent: "center",
                                        minWidth: 60,
                                        minHeight: 40,
                                    }}
                                >
                                    {role && role == 1
                                        ? "Khóa học của tôi"
                                        : role == 2
                                        ? "Khóa học đăng ký"
                                        : "Dashboard"}
                                </ListItem>

                                <ListItem
                                    component="button"
                                    color="primary"
                                    onMouseEnter={handlePopoverProfileHover}
                                    onMouseLeave={handlePopoverProfileClose}
                                    onClick={handleLogout}
                                    sx={{
                                        justifyContent: "center",
                                        minWidth: 60,
                                        minHeight: 40,
                                    }}
                                >
                                    Đăng xuất
                                </ListItem>
                            </List>
                        </Grid>
                    </Popover>
                </Toolbar>
            </Container>
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 250,
                        backgroundColor: "#f1f1f1", // Set background color of the Drawer
                        color: "black",
                    },
                }}
            >
                <Box
                    sx={{
                        width: 250,
                        color: "black", // Set text color of the Drawer content
                    }}
                    role="presentation"
                    onClick={() => toggleDrawer(false)}
                    onKeyDown={() => toggleDrawer(false)}
                >
                    <List>
                        <ListItem button onClick={() => handleNavigate("")}>
                            Trang chủ
                        </ListItem>
                        <ListItem
                            button
                            onClick={() => handleNavigate("tutor")}
                        >
                            Gia sư
                        </ListItem>
                        <ListItem
                            button
                            onClick={() => handleNavigate("course")}
                        >
                            Khóa học
                        </ListItem>
                        {isLoggedIn ? (
                            <>
                                <ListItem
                                    button
                                    onClick={() => handleNavigate("profile")}
                                >
                                    Tài khoản
                                </ListItem>
                                <ListItem
                                    button
                                    onClick={() => {
                                        if (role == 0)
                                            handleNavigate("dashboard/users");
                                        handleNavigate("my-course");
                                    }}
                                >
                                    {role && role === 1
                                        ? "Khóa học của tôi"
                                        : role === 2
                                        ? "Khóa học đăng ký"
                                        : "Dashboard"}
                                </ListItem>
                                <ListItem button onClick={handleLogout}>
                                    Đăng xuất
                                </ListItem>
                            </>
                        ) : (
                            <>
                                <ListItem
                                    button
                                    onClick={() => handleNavigate("login")}
                                >
                                    Login
                                </ListItem>
                                <ListItem
                                    button
                                    onClick={() => handleNavigate("sign-up")}
                                >
                                    Sign Up
                                </ListItem>
                            </>
                        )}
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
}

export default Header;
