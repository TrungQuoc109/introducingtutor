import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useNavigate } from "react-router-dom";
function AdminHeader({ handleDrawerToggle }) {
    const navigate = useNavigate();
    const username = sessionStorage.getItem("username");
    const nameToken = username + "_name";
    const roleToken = username + "_role";
    const handleLogout = () => {
        localStorage.removeItem(username);
        localStorage.removeItem(nameToken);
        localStorage.removeItem(roleToken);
        sessionStorage.removeItem("username");
        navigate("/login");
    };
    return (
        <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                    Admin Dashboard
                </Typography>
                <IconButton
                    color="inherit"
                    aria-label="logout"
                    onClick={handleLogout}
                    sx={{ ml: "auto" }}
                >
                    <PowerSettingsNewIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default AdminHeader;
