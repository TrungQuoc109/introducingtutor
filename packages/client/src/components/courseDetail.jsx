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
                <Grid item xs={12} sm={6} md={3}>
                    <Typography
                        component="div"
                        variant="body2"
                        color="textPrimary"
                    >
                        <div>
                            Giá:{" "}
                            {!isNaN(course.price)
                                ? course.price.toLocaleString("vi-VN")
                                : "N/A"}
                            {" VND"}
                        </div>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
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
