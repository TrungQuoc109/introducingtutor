import React from "react";
import {
    Container,
    Box,
    CssBaseline,
    Button,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import Header from "../components/header";
import Footer from "../components/footer";
import bg from "../../public/image/bg1.jpg";
function HomePage() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <Header />

                <Box sx={{ bgcolor: "#f1f1f1", height: "100vh", pt: 10 }}>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    margin: 2,
                                    padding: 4,

                                    backgroundColor: "secondary.main",
                                    color: "white",
                                    backgroundImage: `url(${bg})`, // Sử dụng hình ảnh làm nền
                                    backgroundSize: "auto",
                                    opacity: 0.5,
                                }}
                            >
                                <Box
                                    pt={40}
                                    sx={{
                                        height: 500,
                                        textAlign: "center",
                                        // padding: "50px",
                                        // backgroundColor: "#f0f0f0",
                                    }}
                                >
                                    <Typography variant="h4" color={"black"}>
                                        Dạy kèm tại nhà với gia sư uy tín chất
                                        lượng
                                    </Typography>
                                    <Button variant="contained" color="primary">
                                        Tìm Gia Sư Ngay!
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Button>test</Button>
                        </Grid>
                        <Grid item>
                            <Paper elevation={3} style={{ padding: 20 }}>
                                <Typography variant="h5" component="h3">
                                    Nội dung của Paper
                                </Typography>
                                <Typography variant="body1">
                                    Đây là một ví dụ về cách sử dụng Paper trong
                                    Material-UI để hiển thị nội dung.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Footer />
                </Box>
            </Container>
        </React.Fragment>
    );
}

export default HomePage;
