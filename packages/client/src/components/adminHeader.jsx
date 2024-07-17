import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
function AdminHeader({ handleDrawerToggle }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token"); // Xóa token
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
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
                    sx={{ ml: "auto" }} // Đảm bảo nút đăng xuất hiển thị ở phía bên phải của AppBar
                >
                    <PowerSettingsNewIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default AdminHeader;
