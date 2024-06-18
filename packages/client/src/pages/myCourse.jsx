import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Container,
    CssBaseline,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Grid,
    Select,
    MenuItem,
    DialogContent,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import Footer from "../components/footer";
import Header from "../components/header";
import { baseURL, districts, formatDate, statusCourse } from "../config/config";
// Firebase imports
// Nếu DataContext không chứa thông tin về khóa học, bạn không cần sử dụng DataContext ở đây.
import EditCourseDialog from "../components/changeCourse";
import { useNavigate } from "react-router-dom";
import CreateCourseDialog from "../components/createCourseDialog";
import { DataContext } from "../dataprovider/subject";
export default function MyCourse() {
    const [clickedCourseId, setClickedCourseId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [openDialogStatus, setOpenDialogStatus] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [locations, setLocations] = useState([]);
    const [pendingStatusChange, setPendingStatusChange] = useState({
        courseId: null,
        status: null,
    });
    const subjects = useContext(DataContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const handleStatusChange = (courseId, event) => {
        const newStatus = event.target.value;
        setPendingStatusChange({ courseId, status: newStatus });
        setOpenDialogStatus(true); // Mở dialog
    };
    const handleCloseDialog = (isConfirmed) => {
        setOpenDialogStatus(false);
        if (isConfirmed) {
            const { courseId, status } = pendingStatusChange;
            setSelectedStatuses({ ...selectedStatuses, [courseId]: status });
            setPendingStatusChange({ courseId: null, status: null });
        }
    };
    const fetchLocation = async () => {
        try {
            const response = await fetch(
                `${baseURL}/tutor/get-tutor-location`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();

                setLocations(data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const fetchData = async () => {
        try {
            const response = await fetch(`${baseURL}/user/get-my-courses`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCourses(data.data.courses);
                const newSelectedStatuses = data.data.courses.reduce(
                    (acc, course) => ({
                        ...acc,
                        [course.id]: course.status,
                    }),
                    {}
                );
                setSelectedStatuses(newSelectedStatuses);
            } else {
                console.error("Failed to fetch profile data");
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };
    useEffect(() => {
        fetchLocation();
        fetchData();
    }, []);
    const handleCardClick = (tutorId) => {
        navigate(`/tutor-detail`, { state: { tutorId: tutorId } });
    };

    const handleListItemClick = (courseId) => {
        setClickedCourseId(courseId);
        setTimeout(() => {
            setClickedCourseId(null);
        }, 200);
        navigate(`/course-detail/${courseId}`);
    };

    const openEditDialog = (course) => {
        setEditingCourse(course);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleSave = (editedCourse) => {
        console.log(editedCourse);
    };

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const handleCreateCourseClick = () => {
        setIsCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
        fetchData();
    };

    const handleSaveNewCourse = (courseInfo) => {
        console.log("Thông tin khóa học mới:", courseInfo);
        // Gửi thông tin khóa học mới tới server qua API ở đây
    };
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="xl">
                <Box
                    sx={{
                        bgcolor: "#f1f1f1",
                        minHeight: "100vh",
                        pt: 12,
                        pb: 4,
                    }}
                >
                    <Header />
                    <Container maxWidth="lg">
                        <Grid
                            container
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <Typography variant="h4" gutterBottom>
                                    Các Khóa Học Của Tôi
                                </Typography>
                            </Grid>
                            {role == 1 ? (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCreateCourseClick}
                                    >
                                        Tạo Khóa Học
                                    </Button>{" "}
                                    <CreateCourseDialog
                                        isOpen={isCreateDialogOpen}
                                        onClose={handleCloseCreateDialog}
                                        onSave={handleSaveNewCourse}
                                        subjects={subjects && subjects.data}
                                        locations={locations ?? []}
                                    />
                                </>
                            ) : null}
                        </Grid>
                        <List>
                            {courses.map((course) => (
                                <ListItem key={course.id} divider>
                                    <Grid
                                        container
                                        spacing={2}
                                        alignItems="center"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Grid
                                            item
                                            xs={8}
                                            onClick={() =>
                                                handleListItemClick(course.id)
                                            }
                                            sx={{
                                                ...(clickedCourseId ===
                                                    course.id && {
                                                    bgcolor: "primary.light",
                                                    color: "white",
                                                    transition: "all 0.5s ease",
                                                }),
                                                cursor: "pointer",
                                            }}
                                        >
                                            <ListItemText
                                                primary={`${course.name}`}
                                                secondary={
                                                    <React.Fragment>
                                                        <Grid
                                                            container
                                                            spacing={2}
                                                            alignItems="center"
                                                        >
                                                            <Grid item xs>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="textPrimary"
                                                                >
                                                                    Môn:{" "}
                                                                    {
                                                                        course
                                                                            .Subject
                                                                            .name
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="textPrimary"
                                                                >
                                                                    | Lớp:{" "}
                                                                    {
                                                                        course.gradeLevel
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="textPrimary"
                                                                >
                                                                    | Ngày bắt
                                                                    đầu:{" "}
                                                                    {formatDate(
                                                                        course.startDate
                                                                    )}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="textSecondary"
                                                                >
                                                                    Địa chỉ:{" "}
                                                                    {
                                                                        districts.find(
                                                                            (
                                                                                district
                                                                            ) =>
                                                                                district.id ==
                                                                                course.location
                                                                        ).name
                                                                    }
                                                                    | Giá:{" "}
                                                                    {
                                                                        course.price
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </React.Fragment>
                                                }
                                            />
                                        </Grid>
                                        {role == 1 ? (
                                            <>
                                                <Grid item xs={2}>
                                                    <Select
                                                        value={
                                                            selectedStatuses[
                                                                course.id
                                                            ]
                                                        }
                                                        onChange={(event) => {
                                                            event.stopPropagation();
                                                            handleStatusChange(
                                                                course.id,
                                                                event
                                                            );
                                                        }}
                                                        size="small"
                                                        fullWidth
                                                    >
                                                        {statusCourse &&
                                                            statusCourse.map(
                                                                (
                                                                    status,
                                                                    index
                                                                ) => (
                                                                    <MenuItem
                                                                        key={
                                                                            index
                                                                        }
                                                                        value={
                                                                            index
                                                                        }
                                                                    >
                                                                        {status}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                    </Select>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={2}
                                                    style={{
                                                        textAlign: "right",
                                                    }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            openEditDialog(
                                                                course
                                                            );
                                                        }}
                                                    >
                                                        Chỉnh sửa
                                                    </Button>
                                                </Grid>{" "}
                                            </>
                                        ) : (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={4}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-end",
                                                }}
                                            >
                                                <Typography
                                                    color="textPrimary"
                                                    style={{
                                                        fontWeight: "bold",
                                                        marginBottom: "8px", // Khoảng cách giữa tên và nút
                                                    }}
                                                    onClick={() => {
                                                        handleCardClick(
                                                            course.Tutor.id
                                                        );
                                                    }} // Thêm handler cho sự kiện click
                                                >
                                                    Gia sư:{" "}
                                                    {course.Tutor.User.name}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    onClick={(event) => {
                                                        event.stopPropagation(); // Ngăn chặn sự kiện lan tỏa
                                                        // cancelRegistration(
                                                        //     course.id
                                                        // );
                                                        console.log("huy");
                                                    }}
                                                >
                                                    Hủy đăng ký
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                </ListItem>
                            ))}
                        </List>
                        {editingCourse && (
                            <EditCourseDialog
                                course={editingCourse}
                                isOpen={isDialogOpen}
                                onClose={handleDialogClose}
                                onSave={handleSave}
                            />
                        )}
                        <Dialog
                            open={openDialogStatus}
                            onClose={() => handleCloseDialog(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Xác nhận thay đổi trạng thái"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Bạn có chắc chắn muốn thay đổi trạng thái
                                    của khóa học này không?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => handleCloseDialog(false)}
                                    color="primary"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={() => handleCloseDialog(true)}
                                    color="primary"
                                    autoFocus
                                >
                                    Xác nhận
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Container>
                </Box>
                <Footer />
            </Container>
        </React.Fragment>
    );
}
