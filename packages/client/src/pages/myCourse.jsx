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
import Header from "../components/header";
import {
    baseURL,
    districts,
    formatDate,
    paymentStatus,
    statusCourse,
} from "../config/config";
// Firebase imports
// Nếu DataContext không chứa thông tin về khóa học, bạn không cần sử dụng DataContext ở đây.
import { useNavigate } from "react-router-dom";
import CreateCourseDialog from "../components/createCourseDialog";
import CourseDetails from "../components/courseDetail";
import Footer from "../components/Footer";
export default function MyCourse() {
    const [dialogAction, setDialogAction] = useState(null); // 'edit', 'cancel'
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

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const openEditDialog = (course) => {
        setIsDialogOpen(true);
        setDialogMode("edit");
        setEditingCourse(course);
    };
    const openCreateDialog = () => {
        setIsDialogOpen(true);
        setDialogMode("create");
        setEditingCourse(null); // Đảm bảo không có dữ liệu của khóa học nào được tải trước
    };
    const openCancelDialog = (courseId) => {
        setOpenDialogStatus(true);
        setPendingStatusChange({ courseId: courseId, status: null });
        setDialogAction("cancel");
    };

    const handleStatusChange = (courseId, event) => {
        setDialogAction("edit");
        const newStatus = event.target.value;
        setPendingStatusChange({ courseId, status: newStatus });
        setOpenDialogStatus(true);
    };
    const handleCloseDialog = async (isConfirmed) => {
        setOpenDialogStatus(false);
        try {
            if (isConfirmed) {
                const { courseId, status } = pendingStatusChange;
                if (dialogAction === "edit") {
                    setSelectedStatuses({
                        ...selectedStatuses,
                        [courseId]: status,
                    });
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

                    if (response.ok || response.status == 400) {
                        const data = await response.json();
                        alert(data.message ?? data.error);
                    }
                    setPendingStatusChange({ courseId: null, status: null });
                } else {
                    const { courseId } = pendingStatusChange;
                    const response = await fetch(
                        `${baseURL}/student/cancel-course`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ courseId }),
                        }
                    );
                    const data = await response.json();
                    if (response.ok) {
                        alert(data.message);
                    } else {
                        if (response.status >= 500) {
                            throw new Error(data.error);
                        }
                        alert(data.error);
                    }
                }
            }
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

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
                    navigate("/my-course");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, [location.search]);
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
                                {courses.map((course) =>
                                    course.StudentTeachingSubjectMaps ? (
                                        course.StudentTeachingSubjectMaps.map(
                                            (item) => (
                                                <ListItem
                                                    key={course.id}
                                                    divider
                                                >
                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        alignItems="center"
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
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
                                                                primary={
                                                                    <Typography variant="h5">
                                                                        {
                                                                            course.name
                                                                        }
                                                                    </Typography>
                                                                }
                                                                secondary={
                                                                    <CourseDetails
                                                                        course={
                                                                            course
                                                                        }
                                                                        districts={
                                                                            districts
                                                                        }
                                                                        role={
                                                                            role
                                                                        }
                                                                        status={
                                                                            item.status
                                                                        }
                                                                        formatDate={
                                                                            formatDate
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </Grid>

                                                        <Grid
                                                            item
                                                            xs={12}
                                                            sm={4}
                                                            style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                    "column",
                                                                alignItems:
                                                                    "flex-end",
                                                            }}
                                                        >
                                                            <Typography
                                                                color="textPrimary"
                                                                style={{
                                                                    fontWeight:
                                                                        "bold",
                                                                    marginBottom:
                                                                        "8px",
                                                                }}
                                                                onClick={() => {
                                                                    handleCardClick(
                                                                        course
                                                                            .Tutor
                                                                            .id
                                                                    );
                                                                }}
                                                            >
                                                                Gia sư:{" "}
                                                                {
                                                                    course.Tutor
                                                                        .User
                                                                        .name
                                                                }
                                                            </Typography>
                                                            <Button
                                                                variant="contained"
                                                                disabled={
                                                                    item.status ==
                                                                    2
                                                                }
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    event.stopPropagation();
                                                                    openCancelDialog(
                                                                        course.id
                                                                    );
                                                                }}
                                                            >
                                                                Hủy đăng ký
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </ListItem>
                                            )
                                        )
                                    ) : (
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
                                                        ...(clickedCourseId ==
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
                                                        primary={
                                                            <Typography variant="h5">
                                                                {course.name}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <CourseDetails
                                                                course={course}
                                                                districts={
                                                                    districts
                                                                }
                                                                role={role}
                                                                formatDate={
                                                                    formatDate
                                                                }
                                                            />
                                                        }
                                                    />
                                                </Grid>
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
                                            </Grid>
                                        </ListItem>
                                    )
                                )}
                            </List>
                        )}

                        <Dialog
                            open={openDialogStatus}
                            onClose={() => handleCloseDialog(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle
                                id="alert-dialog-title"
                                sx={{ textAlign: "center" }}
                            >
                                {dialogAction === "edit"
                                    ? "Xác nhận thay đổi trạng thái"
                                    : "Xác nhận hủy khóa học"}
                            </DialogTitle>
                            <DialogContent>
                                {dialogAction === "edit" ? (
                                    <DialogContentText id="alert-dialog-description">
                                        Bạn có chắc chắn muốn thay đổi trạng
                                        thái của khóa học này không?
                                    </DialogContentText>
                                ) : (
                                    <>
                                        <DialogContentText
                                            id="alert-dialog-description"
                                            sx={{
                                                color: "black",
                                                fontSize: 20,
                                            }}
                                        >
                                            Bạn có chắc chắn muốn hủy khóa học
                                            này không?
                                        </DialogContentText>
                                        <DialogContentText
                                            id="alert-dialog-description-refund-policy"
                                            sx={{ color: "black" }}
                                        >
                                            Chính sách hoàn tiền khi hủy khóa
                                            học như sau (tính từ ngày bắt đầu
                                            khoá học):
                                            <ul>
                                                <li>
                                                    Nếu hủy trước 7 ngày trở
                                                    lên: 95%.
                                                </li>
                                                <li>
                                                    Nếu huỷ trước từ 3 đến 7
                                                    ngày: 70%
                                                </li>
                                                <li>
                                                    Nếu huỷ trước từ 0 đến 3
                                                    ngày: 50%
                                                </li>
                                                <li>
                                                    Nếu huỷ sau ngày bắt đầu
                                                    khoá học: 0%
                                                </li>
                                            </ul>
                                        </DialogContentText>
                                    </>
                                )}
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
            </Container>
            <Footer />
        </React.Fragment>
    );
}
