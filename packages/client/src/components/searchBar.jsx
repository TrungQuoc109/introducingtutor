// File: SearchBar.js
import React, { useContext, useState } from "react";
import {
    Paper,
    InputBase,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { districts } from "../config/config";

const SearchBar = ({
    searchTerm,
    setSearchTerm,
    subject,
    setSubject,
    location,
    setLocation,
    subjects,
    performSearch,
    handleKeyPress,
}) => {
    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
    };

    // Handler cập nhật giá trị cho Khu vực
    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };
    return (
        <Paper
            component="form"
            sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Tìm kiếm..."
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={handleKeyPress}
            />
            <FormControl sx={{ mx: 1, width: 140 }}>
                <InputLabel id="subject-select-label">Môn học</InputLabel>
                <Select
                    labelId="subject-select-label"
                    id="subject-select"
                    value={subject}
                    onChange={handleSubjectChange}
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
                        [
                            <MenuItem key={-1} value="">
                                <em>None</em>
                            </MenuItem>,
                        ].concat(
                            subjects.data.map((subj) => (
                                <MenuItem key={subj.id} value={subj.id}>
                                    {subj.name}
                                </MenuItem>
                            ))
                        )}
                </Select>
            </FormControl>
            <FormControl sx={{ width: 200 }}>
                <InputLabel id="location-select-label">Khu vực</InputLabel>
                <Select
                    labelId="location-select-label"
                    id="location-select"
                    value={location}
                    onChange={handleLocationChange}
                    label="Khu vực"
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 200,
                            },
                        },
                    }}
                >
                    {[
                        <MenuItem key={-1} value="">
                            <em>None</em>
                        </MenuItem>,
                    ].concat(
                        districts.map((district) => (
                            <MenuItem key={district.id} value={district.id}>
                                {district.name}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>
            <IconButton
                type="submit"
                sx={{ p: "10px" }}
                aria-label="search"
                onClick={performSearch}
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    );
};

export default SearchBar;
