import React, { useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Button,
} from "@mui/material";

const SubjectSelect = ({ allOptions, selectedOptions, onChange, label }) => {
    const [newSubjects, setNewSubjects] = useState([]);

    const handleNewSubjectChange = (event) => {
        const { value } = event.target;
        setNewSubjects(value);
    };

    const handleAddSubject = () => {
        onChange([...selectedOptions, ...newSubjects]);
        setNewSubjects([]);
    };
    const renderSubjectText = (subjectId) => {
        const subject = allOptions.find((item) => item.id === subjectId);
        return subject ? subject.name : "";
    };
    const renderNames = (selectedIds, array) => {
        let itemsArray = Array.isArray(array) ? array : array.data;
        return selectedIds
            .map((id) => itemsArray.find((item) => item.id == id)?.name)
            .filter((name) => name)
            .join(", ");
    };

    return (
        <div>
            <Typography variant="body1" gutterBottom>
                {label} Đã chọn: {renderNames(selectedOptions, allOptions)}
            </Typography>

            <Typography variant="body2" gutterBottom></Typography>

            <FormControl fullWidth>
                <InputLabel id="subject-label">Thêm </InputLabel>
                <Select
                    labelId="subject-label"
                    id="subject-select"
                    label="Thêm "
                    multiple
                    value={newSubjects}
                    onChange={handleNewSubjectChange}
                    renderValue={(selected) =>
                        selected.map(renderSubjectText).join(", ")
                    }
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 200,
                            },
                        },
                    }}
                >
                    {allOptions.map((subject) => (
                        <MenuItem
                            key={subject.id}
                            value={subject.id}
                            disabled={selectedOptions.includes(subject.id)}
                        >
                            {subject.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleAddSubject}
                disabled={newSubjects.length === 0}
                sx={{
                    m: 2, // Top margin
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "100px", // Set a fixed width
                    borderRadius: 2, // Add rounded corners
                    transition: "transform 0.2s", // Smooth scaling on hover
                    "&:hover": {
                        transform: "scale(1.05)", // Slightly scale up on hover
                    },
                    "&:active": {
                        transform: "scale(0.95)", // Slightly scale down when clicked
                    },
                    "&:disabled": {
                        backgroundColor: "grey.500", // Disable button style
                        cursor: "default",
                    },
                }}
            >
                Thêm
            </Button>
        </div>
    );
};

export default SubjectSelect;
