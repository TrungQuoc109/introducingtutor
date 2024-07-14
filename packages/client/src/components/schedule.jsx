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
import { getDayOfWeekLabel } from "../config/config";

const Schedule = ({ data, role }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" colSpan={5}>
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
                        <TableCell align="center">Số thứ tự</TableCell>
                        <TableCell align="center">Tên khoá học</TableCell>
                        <TableCell align="center">Thứ</TableCell>
                        <TableCell align="center">Giờ học</TableCell>
                        <TableCell align="center">Thời lượng</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell align="center">{index + 1}</TableCell>{" "}
                            <TableCell>{item.TeachingSubject.name}</TableCell>{" "}
                            <TableCell align="center">
                                {getDayOfWeekLabel(item.dayOfWeek)}
                            </TableCell>
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
