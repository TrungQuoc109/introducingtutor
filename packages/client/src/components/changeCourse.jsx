import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Grid,
} from "@mui/material";

export default function EditCourseDialog({ course, isOpen, onClose, onSave }) {
    const [editData, setEditData] = useState(course);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = () => {
        onSave(editData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Chỉnh sửa khóa học</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="name"
                            label="Tên Khóa Học"
                            fullWidth
                            variant="outlined"
                            value={editData.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin="dense"
                            name="description"
                            multiline
                            rows={4}
                            label="Mô Tả"
                            fullWidth
                            type="text"
                            variant="outlined"
                            value={editData.description}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            name="gradeLevel"
                            label="Lớp"
                            fullWidth
                            type="number"
                            variant="outlined"
                            value={editData.gradeLevel}
                            onChange={handleChange}
                            inputProps={{ min: 1, max: 12 }}
                        />
                    </Grid>{" "}
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            name="studentCount"
                            label="Số học viên"
                            fullWidth
                            type="number"
                            variant="outlined"
                            value={editData.studentCount}
                            onChange={handleChange}
                        />{" "}
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            name="startDate"
                            label="Ngày bắt đầu"
                            fullWidth
                            type="date"
                            variant="outlined"
                            value={editData.startDate}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>{" "}
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            name="numberOfSessions"
                            label="Số buổi"
                            fullWidth
                            type="number"
                            variant="outlined"
                            value={editData.numberOfSessions}
                            onChange={handleChange}
                        />{" "}
                    </Grid>{" "}
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            name="price"
                            label="Giá tiền"
                            fullWidth
                            type="number"
                            variant="outlined"
                            value={editData.price}
                            onChange={handleChange}
                        />{" "}
                    </Grid>{" "}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy bỏ</Button>
                <Button onClick={handleSave}>Lưu Thay Đổi</Button>
            </DialogActions>
        </Dialog>
    );
}
