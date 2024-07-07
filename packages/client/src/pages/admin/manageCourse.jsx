import React, { useState } from "react";
import {
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Paper,
} from "@mui/material";

function CourseManagement() {
    const [courses, setCourses] = useState([
        { id: 1, name: "Math 101", instructor: "John Doe" },
        { id: 2, name: "Physics 201", instructor: "Jane Smith" },
    ]);
    const [open, setOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: "", instructor: "" });

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddCourse = () => {
        setCourses([...courses, { id: courses.length + 1, ...newCourse }]);
        handleClose();
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Manage Courses
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Add Course
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the details of the new course.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Course Name"
                        fullWidth
                        value={newCourse.name}
                        onChange={(e) =>
                            setNewCourse({ ...newCourse, name: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Instructor"
                        fullWidth
                        value={newCourse.instructor}
                        onChange={(e) =>
                            setNewCourse({
                                ...newCourse,
                                instructor: e.target.value,
                            })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddCourse} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <Paper sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Course Name</TableCell>
                            <TableCell>Instructor</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((course) => (
                            <TableRow key={course.id}>
                                <TableCell>{course.id}</TableCell>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.instructor}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}

export default CourseManagement;
