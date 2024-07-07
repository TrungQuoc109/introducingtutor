import React from "react";
import { Grid, Typography } from "@mui/material";
import { paymentStatus } from "../config/config";

const CourseDetails = ({ course, districts, role, status, formatDate }) => {
    return (
        <React.Fragment>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={6}>
                    <Typography
                        component="div"
                        variant="body2"
                        color="textPrimary"
                    >
                        <div>Môn: {course.Subject.name}</div>
                        <div>
                            Địa chỉ: {course.specificAddress},{" "}
                            {
                                districts.find(
                                    (district) => district.id == course.location
                                )?.name
                            }
                        </div>
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Typography
                        component="div"
                        variant="body2"
                        color="textPrimary"
                    >
                        <div>Lớp: {course.gradeLevel}</div>
                        <div>Giá: {course.price}</div>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography
                        component="div"
                        variant="body2"
                        color="textPrimary"
                    >
                        <div>Ngày bắt đầu: {formatDate(course.startDate)}</div>
                        {role == 2 && (
                            <div>Trạng Thái: {paymentStatus[status]}</div>
                        )}
                    </Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default CourseDetails;
