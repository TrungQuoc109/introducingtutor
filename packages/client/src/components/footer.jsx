import React from "react";
import Box from "@mui/material/Box";
import { IoLocation } from "react-icons/io5";
import Container from "@mui/material/Container";
import { FaPhone } from "react-icons/fa";
import Link from "@mui/material/Link";

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
                                        src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/347820247_1280945992539999_1915767725978544383_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeG9WnlvddTwVIZQBJvTZZKSv8KNred9PqO_wo2t530-o-UCb7rs6BcphFIw9tR17U3sDPQrrEtmJfejr6NwQy_N&_nc_ohc=GGI0csNRligQ7kNvgHFsClZ&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYDGf7mU1fpLTqVF-gqbwAL--Lavwq9Mo6NPiCb0St1ONQ&oe=664FF7F2"
                                        style={logoStyle}
                                        alt="logo of sitemark"
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
