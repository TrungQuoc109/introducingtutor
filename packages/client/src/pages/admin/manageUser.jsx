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
    userRole,
    userStatus,
    districts,
    renderNames,
} from "../../config/config";
import { DataContext } from "../../dataprovider/subject";

function UserManagement() {
    const token = localStorage.getItem("token");
    const [profile, setProfile] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [searchText, setSearchText] = useState("");
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const subjects = useContext(DataContext);
    // Function to fetch data based on role, status, subject, district, and page
    const fetchData = async (role, status, subject, district, page) => {
        setLoading(true);
        try {
            let url = `${baseURL}/admin/get-list-user?page=${
                page === 0 ? 0 : page - 1
            }`;
            if (role) url += `&role=${role}`;
            if (status) url += `&status=${status}`;
            if (subject) url += `&subject=${subject}`;
            if (district) url += `&district=${district}`;
            if (searchText) url += `&searchText=${searchText}`;
            console.log(subject);
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setUsers(data.data.users);
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
            selectedRole,
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
        fetchData(
            selectedRole,
            selectedStatus,
            selectedSubject,
            selectedDistrict,
            0
        );
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const response = await fetch(
                `${baseURL}/admin/change-status-user/${userId}`,
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
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId
                            ? { ...user, status: newStatus }
                            : user
                    )
                );
            } else {
                console.error("Failed to update user status");
            }
        } catch (error) {
            console.error("Failed to update user status", error);
        }
    };
    const fetchProfileUser = async (userId) => {
        try {
            const response = await fetch(
                `${baseURL}/admin/get-profile-user/${userId}`,
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
                setProfile(data.user);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const toggleExpand = (userId) => {
        setExpandedUserId((prevUserId) => {
            const newUserId = prevUserId === userId ? null : userId;
            if (newUserId !== null) {
                fetchProfileUser(userId);
            }
            console.log(profile);
            return newUserId;
        });
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Quản lý người dùng
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
                    <InputLabel>Vai trò</InputLabel>
                    <Select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        label="Vai trò"
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {Object.entries(userRole).map(
                            ([roleValue, roleLabel]) => (
                                <MenuItem key={roleValue} value={roleValue}>
                                    {roleLabel}
                                </MenuItem>
                            )
                        )}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 186, maxWidth: 300 }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        label="Trạng thái"
                    >
                        <MenuItem value="">
                            <em>Tất cả</em>
                        </MenuItem>
                        {Object.entries(userStatus).map(
                            ([statusValue, statusLabel]) => (
                                <MenuItem key={statusValue} value={statusValue}>
                                    {statusLabel}
                                </MenuItem>
                            )
                        )}
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
                                    Họ và tên
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ borderRight: "1px solid black" }}
                                >
                                    Email
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ borderRight: "1px solid black" }}
                                >
                                    Số điện thoại
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ borderRight: "1px solid black" }}
                                >
                                    Vai trò
                                </TableCell>
                                <TableCell align="center" sx={{ width: 150 }}>
                                    Trạng thái
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user, index) => (
                                <React.Fragment key={user.id}>
                                    <TableRow
                                        key={user.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpand(user.id);
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
                                            {user.id}
                                        </TableCell>
                                        <TableCell align="center">
                                            {user.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {user.email}
                                        </TableCell>
                                        <TableCell align="center">
                                            {user.phoneNumber}
                                        </TableCell>
                                        <TableCell align="center">
                                            {userRole[user.role]}
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                fullWidth
                                                value={user.status}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                onChange={(e) => {
                                                    handleStatusChange(
                                                        user.id,
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                {Object.entries(userStatus).map(
                                                    ([
                                                        statusValue,
                                                        statusLabel,
                                                    ]) => (
                                                        <MenuItem
                                                            key={statusValue}
                                                            value={statusValue}
                                                        >
                                                            {statusLabel}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </TableCell>
                                    </TableRow>

                                    {profile && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                sx={{ padding: 0 }}
                                            >
                                                <Collapse
                                                    in={
                                                        expandedUserId ===
                                                        user.id
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
                                                                    {profile.role ==
                                                                    2 ? (
                                                                        <Typography>
                                                                            Lớp:{" "}
                                                                            {
                                                                                profile
                                                                                    .Student
                                                                                    .gradeLevel
                                                                            }
                                                                        </Typography>
                                                                    ) : (
                                                                        <>
                                                                            <Typography>
                                                                                Trình
                                                                                độ:{" "}
                                                                                {
                                                                                    profile
                                                                                        .Tutor
                                                                                        .education
                                                                                }
                                                                            </Typography>
                                                                            <Typography>
                                                                                Kinh
                                                                                nghiệm:{" "}
                                                                                {
                                                                                    profile
                                                                                        .Tutor
                                                                                        .experience
                                                                                }
                                                                            </Typography>
                                                                            <Typography>
                                                                                Môn
                                                                                giảng
                                                                                dạy:{" "}
                                                                                {renderNames(
                                                                                    profile.subjects.map(
                                                                                        (
                                                                                            subject
                                                                                        ) =>
                                                                                            subject.subjectId
                                                                                    ),
                                                                                    subjects
                                                                                )}
                                                                            </Typography>
                                                                            <Typography>
                                                                                Khu
                                                                                vực
                                                                                giảng
                                                                                dạy:{" "}
                                                                                {renderNames(
                                                                                    profile.locations.map(
                                                                                        (
                                                                                            location
                                                                                        ) =>
                                                                                            location.districtsId
                                                                                    ),
                                                                                    districts
                                                                                )}
                                                                            </Typography>
                                                                        </>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Box margin={2}>
                                                                <Typography
                                                                    variant="body1"
                                                                    gutterBottom
                                                                >
                                                                    {profile.role ==
                                                                    2
                                                                        ? "Khoá học đăng ký"
                                                                        : "Khoá học đã mở"}
                                                                    :
                                                                </Typography>

                                                                <Box pl={6}>
                                                                    {profile
                                                                        .courses
                                                                        .length ==
                                                                    0 ? (
                                                                        <Typography>
                                                                            Chưa
                                                                            có
                                                                            khoá
                                                                            học
                                                                            nào.
                                                                        </Typography>
                                                                    ) : (
                                                                        profile.courses.map(
                                                                            (
                                                                                course,
                                                                                index
                                                                            ) => (
                                                                                <Typography
                                                                                    key={
                                                                                        course.id
                                                                                    }
                                                                                >
                                                                                    {index +
                                                                                        1 +
                                                                                        ". " +
                                                                                        course.name}
                                                                                </Typography>
                                                                            )
                                                                        )
                                                                    )}
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

export default UserManagement;
