import React, { useCallback, useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import CreateCourseDialog from "../components/createCourseDialog";
export default function MyCourse() {
    const [clickedCourseId, setClickedCourseId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [openDialogStatus, setOpenDialogStatus] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [editingCourse, setEditingCourse] = useState(null);
    const [locations, setLocations] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [dialogMode, setDialogMode] = useState(null); // 'create' hoặc 'edit'
    const [pendingStatusChange, setPendingStatusChange] = useState({
        courseId: null,
        status: null,
    });
    // const [resultCode, setResultCode] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const handleStatusChange = (courseId, event) => {
        const newStatus = event.target.value;
        setPendingStatusChange({ courseId, status: newStatus });
        setOpenDialogStatus(true); // Mở dialog
    };
    const handleCloseDialog = async (isConfirmed) => {
        setOpenDialogStatus(false);
        if (isConfirmed) {
            const { courseId, status } = pendingStatusChange;

            setSelectedStatuses({ ...selectedStatuses, [courseId]: status });
            const response = await fetch(
                `${baseURL}/tutor/change-status-course`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ courseId, status }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
            }
            setPendingStatusChange({ courseId: null, status: null });
        }
    };
    // Ví dụ sử dụng useCallback (Nếu bạn đang sử dụng setResultCode trong callback)
    const updateResultCode = useCallback(async () => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get("resultCode") ?? null;
        const orderId = searchParams.get("orderId") ?? "";

        if (code == 0) {
            try {
                const response = await fetch(
                    `${baseURL}/student/confirm-register-course`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ orderId: orderId }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        //  setResultCode(code);
    }, [location.search]); // Re-run this effect when location.search changes
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
                setSubjects(data.data.subjects);
                setLocations(data.data.location);
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
        const fetchAllData = async () => {
            updateResultCode();
            const promises = [fetchData()];

            if (role == 1) {
                promises.push(fetchLocation());
            }

            await Promise.all(promises);
        };
        fetchAllData();
    }, [updateResultCode]);
    const handleCardClick = (tutorId) => {
        navigate(`/tutor-detail`, { state: { tutorId: tutorId } });
    };

    const handleListItemClick = (courseId) => {
        setClickedCourseId(courseId);
        setTimeout(() => {
            setClickedCourseId(null);
        }, 200);
        navigate(`/course-detail/${courseId}`, {
            state: { fromPage: "mycourse" },
        });
    };

    const openCreateDialog = () => {
        setIsDialogOpen(true);
        setDialogMode("create");
        setEditingCourse(null); // Đảm bảo không có dữ liệu của khóa học nào được tải trước
    };

    const openEditDialog = (course) => {
        setIsDialogOpen(true);
        setDialogMode("edit");
        setEditingCourse(course); // Nạp dữ liệu khóa học vào form để chỉnh sửa
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        fetchData();
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
                                        onClick={openCreateDialog}
                                    >
                                        Tạo Khóa Học
                                    </Button>{" "}
                                    {isDialogOpen && (
                                        <CreateCourseDialog
                                            isOpen={isDialogOpen}
                                            onClose={handleDialogClose}
                                            courseInfo={editingCourse}
                                            subjects={subjects}
                                            locations={locations}
                                        />
                                    )}
                                </>
                            ) : null}
                        </Grid>
                        {courses.length == 0 ? (
                            <Grid>
                                Bạn chưa có khóa học nào...
                                {role == 2 ? (
                                    <Button
                                        onClick={() => {
                                            navigate("/course");
                                        }}
                                    >
                                        Đăng ký khóa học
                                    </Button>
                                ) : null}
                            </Grid>
                        ) : (
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
                                                    handleListItemClick(
                                                        course.id
                                                    )
                                                }
                                                sx={{
                                                    ...(clickedCourseId ===
                                                        course.id && {
                                                        bgcolor:
                                                            "primary.light",
                                                        color: "white",
                                                        transition:
                                                            "all 0.5s ease",
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
                                                                        | Ngày
                                                                        bắt đầu:{" "}
                                                                        {formatDate(
                                                                            course.startDate
                                                                        )}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                >
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body2"
                                                                        color="textSecondary"
                                                                    >
                                                                        Địa chỉ:{" "}
                                                                        {
                                                                            course.specificAddress
                                                                        }
                                                                        {", "}
                                                                        {
                                                                            districts.find(
                                                                                (
                                                                                    district
                                                                                ) =>
                                                                                    district.id ==
                                                                                    course.location
                                                                            )
                                                                                .name
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
                                                            onChange={(
                                                                event
                                                            ) => {
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
                                                                            {
                                                                                status
                                                                            }
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
                                                            onClick={(
                                                                event
                                                            ) => {
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
