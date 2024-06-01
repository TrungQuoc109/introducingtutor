import React, { useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
} from "@mui/material";

const MultiSelectComponent = () => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedOptions(
            typeof value === "string" ? value.split(",") : value
        );
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-multiple-checkbox-label">Options</InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedOptions}
                onChange={handleChange}
                renderValue={(selected) => selected.join(", ")}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        <Checkbox
                            checked={selectedOptions.indexOf(option) > -1}
                        />
                        <ListItemText primary={option} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MultiSelectComponent;
