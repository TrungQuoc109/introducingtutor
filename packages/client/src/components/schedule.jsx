import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from "@mui/material";

const Schedule = ({ data, role }) => {
    console.log(data);
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" colSpan={4}>
                            <Typography
                                variant="h4"
                                component="div"
                                style={{ fontWeight: "bold" }}
                            >
                                {role == 2 ? "Lịch học" : "Lịch Dạy"}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center">Thứ</TableCell>
                        <TableCell align="center">Tên khoá học</TableCell>
                        <TableCell align="center">Giờ học</TableCell>
                        <TableCell align="center">Thời lượng</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell align="center">
                                {item.dayOfWeek}
                            </TableCell>
                            <TableCell>{item.TeachingSubject.name}</TableCell>
                            <TableCell align="center">
                                {item.startTime}
                            </TableCell>
                            <TableCell align="center">
                                {item.duration}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Schedule;
