import React from "react";
import {
    Container,
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    CssBaseline,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Footer from "../components/footer";
import bg from "../../public/image/bg1.jpg";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
function HomePage() {
    const navigate = useNavigate();

    const policies = [
        {
            title: "Chính sách dành cho Gia sư",
            items: [
                "Gia sư phải cung cấp thông tin chính xác và cập nhật về trình độ, kinh nghiệm, và các chứng chỉ liên quan.",
                "Website có quyền từ chối hoặc hủy hồ sơ gia sư nếu phát hiện thông tin không chính xác hoặc vi phạm quy định.",
                "Gia sư chịu trách nhiệm về nội dung, chất lượng và hình thức của khóa học.",
                "Website có quyền yêu cầu gia sư chỉnh sửa hoặc gỡ bỏ khóa học nếu nội dung không phù hợp, vi phạm bản quyền hoặc gây tranh cãi.",
                "Gia sư cần cập nhật thông tin khóa học thường xuyên và thông báo cho học sinh về bất kỳ thay đổi nào.",
                "Gia sư tự quyết định mức học phí cho khóa học của mình.",
                "Website sẽ thu một phần trăm phí hoa hồng trên mỗi giao dịch thành công.",
                "Gia sư sẽ nhận được thanh toán sau khi hoàn thành khóa học và học sinh xác nhận.",
                "Gia sư cần tôn trọng và cư xử chuyên nghiệp với học sinh.",
                "Nghiêm cấm mọi hành vi quấy rối, lừa đảo hoặc gây hại đến học sinh.",
                "Gia sư cần tuân thủ các quy định về bảo mật thông tin cá nhân của học sinh.",
            ],
        },
        {
            title: "Chính sách dành cho Học sinh",
            items: [
                "Học sinh cần cung cấp thông tin cá nhân chính xác để đăng ký tài khoản.",
                "Website có quyền từ chối hoặc hủy tài khoản học sinh nếu phát hiện thông tin không chính xác hoặc vi phạm quy định.",
                "Học sinh có thể tìm kiếm và đăng ký các khóa học phù hợp với nhu cầu của mình.",
                "Học sinh cần thanh toán học phí đầy đủ trước khi bắt đầu khóa học.",
                "Học sinh có thể hủy đăng ký khóa học trong một khoảng thời gian nhất định trước khi khóa học bắt đầu và được hoàn lại một phần học phí theo quy định.",
                "Website không chịu trách nhiệm hoàn tiền nếu học sinh hủy khóa học sau thời gian quy định hoặc không tham gia khóa học.",
                "Học sinh cần tôn trọng và cư xử chuyên nghiệp với gia sư.",
                "Nghiêm cấm mọi hành vi quấy rối, lừa đảo hoặc gây hại đến gia sư.",
                "Học sinh cần tuân thủ các quy định về bảo mật thông tin cá nhân của gia sư.",
            ],
        },
    ];

    return (
        <React.Fragment>
            <CssBaseline />
            <Header />
            {/* Hero Section */}
            <Box
                sx={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" align="center" gutterBottom>
                        Kết nối Gia sư - Học sinh Uy tín
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                        Nền tảng hàng đầu giúp bạn tìm kiếm gia sư phù hợp và
                        nâng cao kết quả học tập
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PlayArrowIcon />}
                            onClick={() => navigate(`/tutor`)}
                        >
                            Tìm Gia sư Ngay
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Dịch vụ */}
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography
                            variant="h4"
                            component="h2"
                            gutterBottom
                            align="center"
                        >
                            Dịch vụ của chúng tôi
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Tìm kiếm gia sư dễ dàng
                        </Typography>
                        <Typography>
                            Với hệ thống tìm kiếm thông minh, bạn có thể dễ dàng
                            tìm thấy gia sư phù hợp với nhu cầu và trình độ của
                            mình.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Đa dạng khóa học
                        </Typography>
                        <Typography>
                            Chúng tôi cung cấp đa dạng các khóa học từ các môn
                            học phổ thông đến các kỹ năng chuyên biệt.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Hỗ trợ 24/7
                        </Typography>
                        <Typography>
                            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp
                            mọi thắc mắc của bạn.
                        </Typography>
                    </Grid>
                </Grid>

                {/* Ưu điểm */}
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12}>
                        <Typography
                            variant="h4"
                            component="h2"
                            gutterBottom
                            align="center"
                        >
                            Ưu điểm của Introducing Tutor
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                            Uy tín và chất lượng
                        </Typography>
                        <Typography>
                            Chúng tôi là nền tảng kết nối gia sư - học sinh uy
                            tín, đảm bảo chất lượng giảng dạy.
                        </Typography>
                        {/* <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Đội ngũ gia sư chuyên nghiệp
                        </Typography>
                        <Typography>
                            Đội ngũ gia sư của chúng tôi đều có kinh nghiệm và
                            trình độ chuyên môn cao.
                        </Typography> */}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                            Đa dạng lựa chọn
                        </Typography>
                        <Typography>
                            Bạn có thể lựa chọn từ hàng ngàn gia sư và khóa học
                            khác nhau.
                        </Typography>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Tiện lợi và dễ sử dụng
                        </Typography>
                        <Typography>
                            Nền tảng của chúng tôi dễ sử dụng và hỗ trợ bạn
                            trong suốt quá trình học tập
                        </Typography>
                    </Grid>
                </Grid>

                {/* Chính sách */}
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12}>
                        <Typography
                            variant="h4"
                            component="h2"
                            gutterBottom
                            align="center"
                        >
                            Chính sách
                        </Typography>
                    </Grid>

                    {policies.map((policyGroup, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Typography variant="h6" gutterBottom>
                                {policyGroup.title}
                            </Typography>
                            <List>
                                {policyGroup.items.map((policy, itemIndex) => (
                                    <ListItem key={itemIndex}>
                                        <ListItemIcon>
                                            <CheckCircleOutlineIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={policy} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Footer />
        </React.Fragment>
    );
}

export default HomePage;
