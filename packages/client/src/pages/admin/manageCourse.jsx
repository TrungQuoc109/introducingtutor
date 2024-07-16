import React, { useContext, useEffect, useState } from "react";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    CircularProgress,
    Box,
    FormControl,
    InputLabel,
    Button,
    Collapse,
    TextField,
    Grid,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import {
    baseURL,
    districts,
    formatDate,
    renderNames,
    statusCourse,
} from "../../config/config";
import { DataContext } from "../../dataprovider/subject";

function CourseManagement() {
    const token = localStorage.getItem("token");
    const [inforCourse, setInforCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [searchText, setSearchText] = useState("");
    const [expandedCourseId, setExpandedCourseId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const subjects = useContext(DataContext);
    // Function to fetch data based on role, status, subject, district, and page
    const fetchData = async (status, subject, district, page) => {
        setLoading(true);
        try {
            let url = `${baseURL}/admin/get-list-course?page=${
                page === 0 ? 0 : page - 1
            }`;

            if (status != -1) url += `&status=${status}`;
            if (subject) url += `&subject=${subject}`;
            if (district) url += `&district=${district}`;
            if (searchText) url += `&searchText=${searchText}`;
            console.log(url);
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setCourses(data.data.courses);

                setTotalPages(data.data.page);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchData(
            selectedStatus,
            selectedSubject,
            selectedDistrict,
            currentPage
        );
    }, [currentPage]);

    // Function to handle page change
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    // Function to handle filter change
    const handleFilterChange = () => {
        setCurrentPage(0);
        fetchData(selectedStatus, selectedSubject, selectedDistrict, 0);
        console.log(selectedStatus);
    };

    const handleStatusChange = async (courseId, newStatus) => {
        try {
            const response = await fetch(
                `${baseURL}/admin/change-status-user/${courseId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ newStatus }),
                }
            );

            if (response.ok) {
                setCourses((prevUsers) =>
                    prevUsers.map((course) =>
                        course.id === courseId
                            ? { ...course, status: newStatus }
                            : course
                    )
                );
            } else {
                console.error("Failed to update user status");
            }
        } catch (error) {
            console.error("Failed to update user status", error);
        }
    };
    const fetchInforCourse = async (courseId) => {
        try {
            const response = await fetch(
                `${baseURL}/admin/get-infor-course/${courseId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (response.ok) {
                setInforCourse(data.course);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const toggleExpand = (courseId) => {
        setExpandedCourseId((prevCourseId) => {
            const newCourseId = prevCourseId === courseId ? null : courseId;
            if (newCourseId !== null) {
                fetchInforCourse(courseId);
            }

            return newCourseId;
        });
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Quản lý khoá học
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                <TextField
                    sx={{ minWidth: 400, maxWidth: 300 }}
                    label="Tìm kiếm"
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <FormControl sx={{ minWidth: 186, maxWidth: 300 }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        label="Trạng thái"
                    >
                        <MenuItem value={-1}>
                            <em>Tất cả</em>
                        </MenuItem>
                        {statusCourse.map((statusName, statusValue) => (
                            <MenuItem key={statusValue} value={statusValue}>
                                {statusName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 186, maxWidth: 300 }}>
                    <InputLabel>Môn giảng dạy</InputLabel>
                    <Select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        label="Môn giảng dạy"
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Tất cả</em>
                        </MenuItem>
                        {subjects &&
                            subjects.data.map((subject) => (
                                <MenuItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 186, maxWidth: 300 }}>
                    <InputLabel>Khu vực giảng dạy</InputLabel>
                    <Select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        label="Khu vực giảng dạy"
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Tất cả</em>
                        </MenuItem>
                        {districts.map((district) => (
                            <MenuItem key={district.id} value={district.id}>
                                {district.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleFilterChange}>
                    Lọc
                </Button>
            </Box>

            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50vh",
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Paper sx={{ mt: 2, overflowX: "auto" }}>
                    <Table sx={{ minWidth: 600 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    align="center"
                                    sx={{
                                        width: 24,
                                        borderRight: "1px solid black",
                                    }}
                                >
                                    STT
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        width: 320,
                                        borderRight: "1px solid black",
                                    }}
                                >
                                    ID
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ borderRight: "1px solid black" }}
                                >
                                    Tên khoá học
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ borderRight: "1px solid black" }}
                                >
                                    Gia sư
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ borderRight: "1px solid black" }}
                                >
                                    Môn học
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ borderRight: "1px solid black" }}
                                >
                                    Giá
                                </TableCell>
                                <TableCell align="center" sx={{ width: 150 }}>
                                    Trạng thái
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course, index) => (
                                <React.Fragment key={course.id}>
                                    <TableRow
                                        key={course.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpand(course.id);
                                        }}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        {" "}
                                        <TableCell
                                            align="center"
                                            sx={{
                                                borderRight: "1px solid black",
                                            }}
                                        >
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            {course.id}
                                        </TableCell>
                                        <TableCell align="center">
                                            {course.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {course.Tutor.User.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {course.Subject.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {!isNaN(course.price)
                                                ? course.price.toLocaleString(
                                                      "vi-VN"
                                                  )
                                                : "N/A"}
                                            {" VND"}
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                fullWidth
                                                value={course.status}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                onChange={(e) => {
                                                    handleStatusChange(
                                                        course.id,
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                {statusCourse.map(
                                                    (
                                                        statusName,
                                                        statusValue
                                                    ) => (
                                                        <MenuItem
                                                            key={statusValue}
                                                            value={statusValue}
                                                        >
                                                            {statusName}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                    {inforCourse && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                sx={{ padding: 0 }}
                                            >
                                                <Collapse
                                                    in={
                                                        expandedCourseId ===
                                                        course.id
                                                    }
                                                    timeout="auto"
                                                    unmountOnExit
                                                >
                                                    {" "}
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            <Box margin={2}>
                                                                <Typography
                                                                    variant="body1"
                                                                    gutterBottom
                                                                >
                                                                    Chi tiết:
                                                                </Typography>

                                                                <Box pl={6}>
                                                                    <Typography>
                                                                        - Mô tả:{" "}
                                                                        {
                                                                            inforCourse.description
                                                                        }
                                                                    </Typography>
                                                                    <Typography>
                                                                        - Ngày
                                                                        bắt đầu:{" "}
                                                                        {formatDate(
                                                                            inforCourse.startDate
                                                                        )}
                                                                    </Typography>
                                                                    <Typography>
                                                                        - Số
                                                                        buổi
                                                                        học:{" "}
                                                                        {
                                                                            inforCourse.numberOfSessions
                                                                        }
                                                                    </Typography>
                                                                    <Typography>
                                                                        - Số học
                                                                        sinh
                                                                        đăng ký:{" "}
                                                                        {inforCourse.countStudent ??
                                                                            0}
                                                                    </Typography>
                                                                    <Typography>
                                                                        - Địa
                                                                        chỉ:{" "}
                                                                        {inforCourse.specificAddress +
                                                                            ", " +
                                                                            districts.find(
                                                                                (
                                                                                    item
                                                                                ) =>
                                                                                    item.id ==
                                                                                    inforCourse.location
                                                                            )
                                                                                ?.name}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                    <Box
                        sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </Paper>
            )}
        </div>
    );
}

export default CourseManagement;
