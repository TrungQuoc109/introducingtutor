import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const drawerWidth = 240;

function Sidebar({ mobileOpen, handleDrawerToggle }) {
    const drawer = (
        <div>
            <List>
                <ListItem button component={Link} to="/dashboard/users">
                    <ListItemText primary="Quản lý người dùng" />
                </ListItem>
                <ListItem button component={Link} to="/dashboard/courses">
                    <ListItemText primary="Quản lý khoá học" />
                </ListItem>
                <ListItem button component={Link} to="/dashboard/salary">
                    <ListItemText primary="Thống kê doanh thu" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <nav>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                        marginTop: "56px",
                    },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                        marginTop: "56px",
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </nav>
    );
}

export default Sidebar;
