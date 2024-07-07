import React, { useState } from "react";
import {
    Box,
    CssBaseline,
    Toolbar,
    Typography,
    Container,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import AdminHeader from "../../components/adminHeader";

function Dashboard() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <CssBaseline />
            <AdminHeader handleDrawerToggle={handleDrawerToggle} />
            <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${240}px)` },
                    ml: { md: `${240}px` },
                    // mt: { xs: `56px`, md: `64px` },
                }}
            >
                <Toolbar />
                <Container maxWidth="false">
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
}

export default Dashboard;
