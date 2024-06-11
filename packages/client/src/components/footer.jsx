import React from "react";
import Box from "@mui/material/Box";
import { IoLocation } from "react-icons/io5";
import Container from "@mui/material/Container";
import { FaPhone } from "react-icons/fa";
import Link from "@mui/material/Link";
import logo from "../../public/image/Logo_STU.png";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

const logoStyle = {
    width: "100px",
    height: "100px",
    cursor: "pointer",
    borderRadius: "50%",
};

export default function Footer() {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: { xs: 4, sm: 8 },
                py: { xs: 4, sm: 4 },
                textAlign: { sm: "center", md: "left" },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        minWidth: { xs: "100%", sm: "60%" },
                    }}
                >
                    <Box sx={{ width: { xs: "100%", sm: "60%" } }}>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            spacing={2}
                        >
                            <Grid item>
                                <Box sx={{ ml: "15px" }}>
                                    <img
                                        src={logo}
                                        style={logoStyle}
                                        alt="logo of stu"
                                    />
                                </Box>
                            </Grid>
                            <Grid item>
                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    TRUNG TÂM GIỚI THIỆU GIA SƯ
                                </Typography>{" "}
                                <Typography variant="subtitle2">
                                    {" "}
                                    <IoLocation /> 180 Cao Lỗ, phường 4, quận 8,
                                    TP Hồ Chí Minh
                                </Typography>
                                <Typography variant="subtitle2">
                                    {" "}
                                    <FaPhone /> 0398454152
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" fontWeight={600}>
                        Product
                    </Typography>
                    <Link color="text.secondary" href="#">
                        Features
                    </Link>
                    <Link color="text.secondary" href="#">
                        Testimonials
                    </Link>
                    <Link color="text.secondary" href="#">
                        Highlights
                    </Link>
                    <Link color="text.secondary" href="#">
                        Pricing
                    </Link>
                    <Link color="text.secondary" href="#">
                        FAQs
                    </Link>
                </Box>
                <Box
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" fontWeight={600}>
                        Company
                    </Typography>
                    <Link color="text.secondary" href="#">
                        About us
                    </Link>
                    <Link color="text.secondary" href="#">
                        Careers
                    </Link>
                    <Link color="text.secondary" href="#">
                        Press
                    </Link>
                </Box>
                <Box
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" fontWeight={600}>
                        Legal
                    </Typography>
                    <Link color="text.secondary" href="#">
                        Terms
                    </Link>
                    <Link color="text.secondary" href="#">
                        Privacy
                    </Link>
                    <Link color="text.secondary" href="#">
                        Contact
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}
