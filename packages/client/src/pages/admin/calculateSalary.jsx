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
    TextField,
    Container,
    Grid,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { baseURL, formatDate } from "../../config/config"; // Adjust imports
import { DataContext } from "../../dataprovider/subject"; // If you still need subjects

function SalaryCalculation() {
    const token = localStorage.getItem("token");
    const [earningsData, setEarningsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    ); // Default current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default current year
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch earnings data for the selected month and year
    const fetchData = async (month, year, page) => {
        setLoading(true);
        try {
            const url = `${baseURL}/admin/get-tutor-earnings?month=${month}&year=${year}&page=${
                page === 0 ? 0 : page - 1
            }`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.data);
                setEarningsData(data.data.earnings); // Assuming backend returns data like this
                setTotalPages(data.data.page);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error("Error fetching earnings data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch (current month) and on month/year change
    useEffect(() => {
        fetchData(selectedMonth, selectedYear, currentPage);
    }, [selectedMonth, selectedYear, currentPage]);

    // Handle page change
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    // Month options (1-12)
    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <Container maxWidth="false" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Thống kê Lương Gia sư
            </Typography>

            <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
            >
                <Grid item>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="select-month-label">
                                Tháng
                            </InputLabel>
                            <Select
                                labelId="select-month-label"
                                id="select-month"
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(e.target.value)
                                }
                                label="Tháng"
                            >
                                {monthOptions.map((month) => (
                                    <MenuItem key={month} value={month}>
                                        {month}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item>
                    <Box sx={{ minWidth: 120 }}>
                        <TextField
                            type="number"
                            label="Năm"
                            value={selectedYear}
                            onChange={(e) =>
                                setSelectedYear(parseInt(e.target.value))
                            }
                            inputProps={{
                                min: 2020,
                                max: new Date().getFullYear(),
                            }}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Box>
                </Grid>
            </Grid>

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
                <Paper sx={{ mt: 4, overflowX: "auto" }} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">STT</TableCell>
                                <TableCell align="center">ID</TableCell>
                                <TableCell align="center">Tên gia sư</TableCell>
                                <TableCell align="center">
                                    Tổng tiền (VND)
                                </TableCell>

                                <TableCell align="center">
                                    Lương thực nhận (VND)
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {earningsData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            ) : (
                                earningsData.map((tutor, index) => (
                                    <TableRow key={tutor.id}>
                                        <TableCell align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            {tutor.id}
                                        </TableCell>
                                        <TableCell align="center">
                                            {tutor.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {tutor.totalearnings.toLocaleString(
                                                "vi-VN"
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {tutor.netEarnings.toLocaleString(
                                                "vi-VN"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    />
                </Paper>
            )}
        </Container>
    );
}

export default SalaryCalculation;
