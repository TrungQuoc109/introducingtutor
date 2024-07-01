import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { IoLocation } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import logo from "../../public/image/Logo_STU.png";

const footerStyle = {
    backgroundColor: "#1976d2",
    color: "#fff",
    paddingTop: "20px",
    borderTop: "1px solid #ccc",
};

const logoStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    cursor: "pointer",
};

const linkStyle = {
    textDecoration: "none",
    color: "#fff",
    marginRight: "20px",

    "&:hover": {
        textDecoration: "underline",
    },
};

const Footer = () => {
    return (
        <Box component="footer" sx={footerStyle}>
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center">
                            <img src={logo} alt="Logo STU" style={logoStyle} />
                            <Box ml={2}>
                                <Typography variant="body2" fontWeight={600}>
                                    TRUNG TÂM GIỚI THIỆU GIA SƯ
                                </Typography>
                                <Typography variant="subtitle2">
                                    <IoLocation /> 180 Cao Lỗ, phường 4, quận 8,
                                    TP Hồ Chí Minh
                                </Typography>
                                <Typography variant="subtitle2">
                                    <FaPhone /> 0398454152
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box display="flex" flexDirection="column">
                            <Typography
                                variant="body2"
                                sx={{ marginBottom: "10px" }}
                            >
                                Đề tài: Website trung gian tìm kiếm gia sư cho
                                học sinh
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ marginBottom: "10px" }}
                            >
                                Tên: Dương Trung Quốc
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ marginBottom: "10px" }}
                            >
                                MSSV: DH52006058
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ marginBottom: "10px" }}
                            >
                                Lớp: D20_TH09
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Box display="flex" flexDirection="column">
                            <Button
                                component="a"
                                href="/"
                                variant="text"
                                style={linkStyle}
                            >
                                Trang chủ
                            </Button>
                            <Button
                                component="a"
                                href="/tutor"
                                variant="text"
                                style={linkStyle}
                            >
                                Gia sư
                            </Button>
                            <Button
                                component="a"
                                href="/course"
                                variant="text"
                                style={linkStyle}
                            >
                                Khoá học
                            </Button>

                            <Button
                                component="a"
                                href="/about-us"
                                variant="text"
                                style={linkStyle}
                            >
                                About Us
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer;
