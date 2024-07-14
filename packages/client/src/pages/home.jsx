import React from "react";
import {
    Container,
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    CssBaseline,
} from "@mui/material";
import Header from "../components/header";
import Footer from "../components/footer";
import bg from "../../public/image/bg1.jpg";
import graduate from "../../public/image/graduate.png";
import book from "../../public/image/book.png";
import online from "../../public/image/online.png";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const WebsiteName = "Introducing Tutor";
    const navigate = useNavigate();

    const divider = [
        {
            img: graduate,
            text: "Đội ngũ gia sư chất lượng cao",
        },
        {
            img: book,
            text: "Tìm gia sư toàn quốc",
        },
        {
            img: online,
            text: "Hỗ trợ nhiệt tình 24/7",
        },
    ];

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="false">
                <Box
                    sx={{
                        bgcolor: "#f1f1f1",
                        minHeight: "100vh",
                        pt: 10,
                        pb: 4,
                    }}
                >
                    <Header />
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    minHeight: "60vh",
                                    position: "relative",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: 2,
                                    padding: 4,
                                    background: `url(${bg}) lightgray no-repeat`,
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={4}>
                            {divider.map((item, index) => (
                                <Grid
                                    item
                                    xs={4}
                                    key={index}
                                    container
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    spacing={2}
                                >
                                    <Grid item xs={6} sx={{ marginLeft: 12 }}>
                                        {" "}
                                        <img
                                            style={{
                                                height: "auto",
                                                maxWidth: "50%",
                                            }}
                                            src={item.img}
                                            alt={item.altText || ""}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        {" "}
                                        <Typography
                                            variant="h6"
                                            component="h2"
                                            textAlign={"center"}
                                        >
                                            {item.text}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ))}
                            <Grid item xs={12}>
                                <Typography
                                    variant="h4"
                                    component="h2"
                                    gutterBottom
                                >
                                    Giới thiệu website gia sư {WebsiteName}
                                </Typography>
                                <Typography>
                                    {WebsiteName} là nền tảng kết nối học sinh
                                    và gia sư uy tín, giúp việc học tập của các
                                    em trở nên hiệu quả hơn. Với đội ngũ gia sư
                                    dày dặn kinh nghiệm và tâm huyết, chúng tôi
                                    cam kết mang đến cho học sinh những trải
                                    nghiệm học tập tốt nhất.
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper elevation={3} sx={{ p: 3 }}>
                                    <Typography variant="h5" gutterBottom>
                                        Dịch vụ của chúng tôi:
                                    </Typography>
                                    <Box>
                                        <Typography>
                                            • Giới thiệu gia sư: Chúng tôi có
                                            đội ngũ gia sư đa dạng...
                                        </Typography>
                                        <Typography>
                                            • Tư vấn học tập: Chúng tôi cung cấp
                                            dịch vụ tư vấn học tập miễn phí...
                                        </Typography>
                                        <Typography>
                                            • Quản lý việc học: Chúng tôi cung
                                            cấp hệ thống quản lý việc học trực
                                            tuyến...
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper elevation={3} sx={{ p: 3 }}>
                                    <Typography variant="h5" gutterBottom>
                                        Ưu điểm của {WebsiteName}:
                                    </Typography>
                                    <Box>
                                        <Typography>
                                            • Uy tín: Chúng tôi là website gia
                                            sư uy tín...
                                        </Typography>
                                        <Typography>
                                            • Chất lượng: Chúng tôi cam kết mang
                                            đến cho học sinh...
                                        </Typography>
                                        <Typography>
                                            • Đa dạng: Chúng tôi có đội ngũ gia
                                            sư đa dạng...
                                        </Typography>
                                        <Typography>
                                            • Tiện lợi: Việc tìm kiếm gia sư và
                                            quản lý việc học tập...
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => {
                                            navigate(`/tutor`);
                                        }}
                                        sx={{ mt: 2 }}
                                    >
                                        Tìm kiếm gia sư
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Container>
            <Footer />
        </React.Fragment>
    );
}

export default HomePage;
