import React from "react";
import {
    Container,
    Box,
    Typography,
    Grid,
    Divider,
    CssBaseline,
} from "@mui/material";
import Header from "../components/header";
import Footer from "../components/Footer";

function AboutUs() {
    return (
        <React.Fragment>
            {" "}
            <CssBaseline />{" "}
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
                    <Container sx={{ py: 1 }}>
                        <Typography variant="h4" gutterBottom align="center">
                            Giới Thiệu về Introducing Tutor
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            1. Tên Dự Án: <strong>Introducing Tutor</strong>
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            2. Người Thực Hiện:{" "}
                            <strong>Dương Trung Quốc</strong>
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            3. Giới Thiệu
                        </Typography>
                        <Typography paragraph>
                            Introducing Tutor là nền tảng trực tuyến kết nối học
                            sinh với đội ngũ gia sư chất lượng cao, uy tín trên
                            khắp cả nước. Ra đời với sứ mệnh mang đến cho học
                            sinh cơ hội tiếp cận giáo dục tốt nhất, Introducing
                            Tutor đã và đang từng bước khẳng định vị trí của
                            mình trong lĩnh vực giáo dục trực tuyến.
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            4. Mục Tiêu
                        </Typography>
                        <Typography paragraph>
                            Các mục tiêu cụ thể của Introducing Tutor:
                        </Typography>
                        <ul>
                            <li>
                                <Typography paragraph>
                                    <strong>Tạo cầu nối hiệu quả:</strong>{" "}
                                    Introducing Tutor hoạt động như một cầu nối
                                    giữa học sinh và gia sư, giúp học sinh dễ
                                    dàng tìm kiếm gia sư phù hợp với nhu cầu và
                                    trình độ của bản thân.
                                </Typography>
                            </li>
                            <li>
                                <Typography paragraph>
                                    <strong>Học tập cá nhân hóa:</strong>{" "}
                                    Introducing Tutor chú trọng vào việc cá nhân
                                    hóa việc học tập cho mỗi học sinh, từ đó
                                    nâng cao hiệu quả học tập.
                                </Typography>
                            </li>
                            <li>
                                <Typography paragraph>
                                    <strong>Trải nghiệm chất lượng cao:</strong>{" "}
                                    Introducing Tutor cam kết mang đến cho học
                                    sinh trải nghiệm học tập chất lượng cao với
                                    đội ngũ gia sư giàu kinh nghiệm, tâm huyết
                                    và được tuyển chọn kỹ lưỡng.
                                </Typography>
                            </li>
                            <li>
                                <Typography paragraph>
                                    <strong>Cộng đồng học tập tích cực:</strong>{" "}
                                    Introducing Tutor không chỉ là nền tảng học
                                    tập mà còn là cộng đồng nơi học sinh có thể
                                    chia sẻ kiến thức, kinh nghiệm và hỗ trợ lẫn
                                    nhau.
                                </Typography>
                            </li>
                        </ul>
                        <Typography variant="h5" gutterBottom>
                            5. Ý Nghĩa
                        </Typography>
                        <Typography paragraph>
                            Introducing Tutor mang đến nhiều ý nghĩa thiết thực
                            cho học sinh, gia sư và cộng đồng:
                        </Typography>
                        <ul>
                            <li>
                                <Typography paragraph>
                                    <strong>Đối với học sinh:</strong>{" "}
                                    Introducing Tutor giúp học sinh dễ dàng tìm
                                    kiếm gia sư chất lượng, từ đó nâng cao kết
                                    quả học tập và phát triển bản thân. Nền tảng
                                    tạo điều kiện cho học sinh học tập mọi lúc,
                                    mọi nơi, theo phương pháp phù hợp với bản
                                    thân.
                                </Typography>
                            </li>
                            <li>
                                <Typography paragraph>
                                    <strong>Đối với gia sư:</strong> Introducing
                                    Tutor giúp gia sư có cơ hội chia sẻ kiến
                                    thức, kinh nghiệm và tạo thu nhập ổn định.
                                    Nền tảng cung cấp cho gia sư môi trường làm
                                    việc chuyên nghiệp và cơ hội phát triển nghề
                                    nghiệp.
                                </Typography>
                            </li>
                            <li>
                                <Typography paragraph>
                                    <strong>Đối với cộng đồng:</strong>{" "}
                                    Introducing Tutor góp phần nâng cao chất
                                    lượng giáo dục và tạo dựng môi trường học
                                    tập tích cực cho cộng đồng. Nền tảng giúp
                                    học sinh phát triển toàn diện và trở thành
                                    những công dân có ích cho xã hội.
                                </Typography>
                            </li>
                        </ul>
                        <Typography variant="h5" gutterBottom>
                            6. Bối Cảnh Nguồn Gốc
                        </Typography>
                        <Typography paragraph>
                            Introducing Tutor được xây dựng từ nhu cầu thực tế
                            của học sinh trong việc tìm kiếm gia sư chất lượng
                            và uy tín. Nền tảng trực tuyến giúp học sinh dễ dàng
                            kết nối với gia sư phù hợp, đồng thời tạo điều kiện
                            cho việc học tập được linh hoạt và hiệu quả hơn.
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            7. Công Nghệ Sử Dụng
                        </Typography>
                        <Typography paragraph>
                            Introducing Tutor được xây dựng dựa trên nền tảng
                            công nghệ hiện đại, đảm bảo tính an toàn, bảo mật và
                            hiệu quả sử dụng. Các công nghệ chính bao gồm
                            ReactJS cho giao diện người dùng, NodeJS cho
                            server-side, và PostgreSQL cho cơ sở dữ liệu.
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            8. Thành Tựu và Kết Quả
                        </Typography>
                        <Typography paragraph>
                            Kể từ khi ra mắt, Introducing Tutor đã đạt được
                            những thành tựu đáng kể như kết nối hàng ngàn học
                            sinh với gia sư và nhận được phản hồi tích cực từ cả
                            học sinh lẫn gia sư về chất lượng dịch vụ.
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            9. Tầm Nhìn và Kế Hoạch Tương Lai
                        </Typography>
                        <Typography paragraph>
                            Với mục tiêu phát triển và cải tiến liên tục,
                            Introducing Tutor đặt ra các kế hoạch như phát triển
                            ứng dụng di động, mở rộng đội ngũ gia sư, và nâng
                            cấp tính năng trên nền tảng.
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            10. Lời Cảm Ơn
                        </Typography>
                        <Typography paragraph>
                            Introducing Tutor gửi lời cảm ơn đến các học sinh,
                            gia sư, và nhà đầu tư đã đồng hành và hỗ trợ cho dự
                            án.
                        </Typography>
                        <Typography variant="body2" align="center">
                            © 2024 Introducing Tutor. All rights reserved.
                        </Typography>{" "}
                        <Divider sx={{ my: 2 }} />
                    </Container>
                </Box>
            </Container>
            <Footer />
        </React.Fragment>
    );
}

export default AboutUs;
