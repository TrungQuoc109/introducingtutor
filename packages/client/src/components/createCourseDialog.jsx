import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { baseURL, districts } from "../config/config";

// Khai báo các trường form dưới dạng mảng
const formFields = [
    { id: "name", label: "Tên Khóa Học", type: "text" },
    {
        id: "description",
        label: "Mô Tả",
        type: "text",
        multiline: true,
        rows: 4,
    },
    { id: "startDate", label: "Ngày Bắt Đầu", type: "date" },
    { id: "numberOfSessions", label: "Số buổi học:", type: "number" },
    //  { id: "gradeLevel", label: "Lớp: ", type: "number" },
    // { id: "studentCount", label: "Số lượng học sinh:", type: "number" },
    { id: "price", label: "Giá", type: "number" },
];
function CustomTextField({ id, label, value, onChange, ...other }) {
    // Tạo một props object để chứa các props có thể thay đổi
    let textFieldProps = {
        fullWidth: true,
        margin: "dense",
        variant: "outlined",
        name: id,
        label: label,
        value: value,
        onChange: onChange,
        ...other,
    };

    // Nếu id là "startDate", thêm InputLabelProps vào props object
    if (id === "startDate") {
        textFieldProps.InputLabelProps = { shrink: true };
    }
    if (id === "gradeLevel") {
        textFieldProps = {
            ...textFieldProps,
            type: "number", // Đảm bảo đây là trường kiểu số
            inputProps: { min: 1, max: 12 }, // Giới hạn giá trị từ 1 đến 12
        };
    }

    return <TextField {...textFieldProps} />;
}

function CreateCourseDialog({
    isOpen,
    onClose,
    //onSave,
    courseInfo,
    subjects,
    locations,
}) {
    const [isChange, setIsChange] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        subjectId: "",
        //  gradeLevel: 1,
        description: "",
        startDate: "",
        numberOfSessions: "",
        location: "",
        specificAddress: "",
        price: 0,
        // studentCount: 0,
    });

    useEffect(() => {
        if (courseInfo && isOpen) {
            setFormData(courseInfo);
            setIsChange(true);
        } else {
            setFormData({
                name: "",
                subjectId: "",
                // gradeLevel: 1,
                description: "",
                startDate: "",
                numberOfSessions: "",
                location: "",
                specificAddress: "",
                price: 0,
                // studentCount: 0,
            });
        }
    }, [courseInfo, isOpen]);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const token = localStorage.getItem("token");
    const handleFormSubmit = async () => {
        if (!isChange) {
            const response = await fetch(`${baseURL}/tutor/teaching-subject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ data: formData }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                onClose();
                // onSave(formData);
            } else {
                alert(data.error);
            }
        } else {
            const response = await fetch(`${baseURL}/tutor/update-course`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ data: formData }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                onClose();
            } else {
                alert(data.error);
            }
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <DialogTitle>
                    {courseInfo ? "Chỉnh Sửa Khóa Học" : "Tạo Khóa Học Mới"}
                </DialogTitle>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {formFields.map(({ id, label, type, ...other }) => (
                        <Grid
                            item
                            xs={id === "description" || id === "name" ? 12 : 6}
                            key={id}
                        >
                            <CustomTextField
                                id={id}
                                label={label}
                                type={type}
                                value={formData[id]}
                                onChange={handleChange}
                                {...other}
                            />
                        </Grid>
                    ))}
                    <Grid item xs={6}>
                        <FormControl
                            fullWidth
                            margin="dense"
                            variant="outlined"
                        >
                            <InputLabel id="subjectId-label">
                                Môn học
                            </InputLabel>
                            <Select
                                labelId="subjectId-label"
                                id="subjectId"
                                name="subjectId"
                                value={formData.subjectId}
                                onChange={handleChange}
                                label="Môn học"
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 200,
                                        },
                                    },
                                }}
                            >
                                {subjects &&
                                    subjects.map((subject) => (
                                        <MenuItem
                                            key={subject.id}
                                            value={subject.id}
                                        >
                                            {subject.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>{" "}
                    <Grid item xs={6}>
                        {/* Ô nhập liệu cho Địa chỉ cụ thể */}
                        <TextField
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            name="specificAddress"
                            label="Địa chỉ cụ thể"
                            value={formData.specificAddress}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl
                            fullWidth
                            margin="dense"
                            variant="outlined"
                        >
                            <InputLabel id="location-label">Quận</InputLabel>
                            <Select
                                labelId="location-label"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                label="Địa điểm dạy"
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 200,
                                        },
                                    },
                                }}
                            >
                                {locations.map((option) => (
                                    <MenuItem
                                        key={option.districtsId}
                                        value={parseInt(option.districtsId)}
                                    >
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Hủy
                </Button>
                <Button onClick={handleFormSubmit} color="primary">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateCourseDialog;
