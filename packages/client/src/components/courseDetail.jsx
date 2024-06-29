import React from "react";
import { Grid, Typography } from "@mui/material";

const CourseDetails = ({
    course,
    districts,
    role,
    paymentStatus,
    formatDate,
}) => {
    return (
        <React.Fragment>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                    <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                    >
                        Môn: {course.Subject.name}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                    >
                        | Lớp: {course.gradeLevel}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                    >
                        | Ngày bắt đầu: {formatDate(course.startDate)}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        <span>
                            Địa chỉ: {course.specificAddress},{" "}
                            {
                                districts.find(
                                    (district) => district.id == course.location
                                )?.name
                            }
                        </span>
                        <span>Giá: {course.price}</span>
                        {role == 2 && (
                            <span>
                                Trạng Thái:{" "}
                                {
                                    paymentStatus[
                                        course.StudentTeachingSubjectMaps[0]
                                            ?.status
                                    ]
                                }
                            </span>
                        )}
                    </Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default CourseDetails;
