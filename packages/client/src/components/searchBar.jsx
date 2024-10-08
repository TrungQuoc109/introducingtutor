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
    Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { districts, genders } from "../config/config.js";

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
    gender,
    setGender,
}) => {
    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };
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
                boxSizing: "border-box",
                flexWrap: { xs: "wrap", md: "nowrap" },
                height: "auto",
            }}
            onSubmit={performSearch}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md>
                    <InputBase
                        sx={{ width: "100%", pl: 1 }}
                        placeholder="Tìm kiếm..."
                        inputProps={{ "aria-label": "search" }}
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                </Grid>
                {gender !== undefined && (
                    <Grid item xs={12} sm={4} md={2}>
                        <FormControl sx={{ width: { xs: "100%", sm: "100%" } }}>
                            <InputLabel id="gender-select-label">
                                Giới tính
                            </InputLabel>
                            <Select
                                labelId="gender-select-label"
                                id="gender-select"
                                value={gender}
                                onChange={handleGenderChange}
                                label="Giới tính"
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
                                        <em>Tất cả</em>
                                    </MenuItem>,
                                ].concat(
                                    genders.map((sex) => (
                                        <MenuItem key={sex.id} value={sex.id}>
                                            {sex.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                )}
                <Grid item xs={12} sm={4} md={2}>
                    <FormControl sx={{ width: { xs: "100%", sm: "100%" } }}>
                        <InputLabel id="subject-select-label">
                            Môn học
                        </InputLabel>
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
                                        <em>Tất cả</em>
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
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                    <FormControl sx={{ width: { xs: "100%", sm: "100%" } }}>
                        <InputLabel id="location-select-label">
                            Khu vực
                        </InputLabel>
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
                                    <em>Tất cả</em>
                                </MenuItem>,
                            ].concat(
                                districts.map((district) => (
                                    <MenuItem
                                        key={district.id}
                                        value={district.id}
                                    >
                                        {district.name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={4}
                    md="auto"
                    display="flex"
                    justifyContent="center"
                >
                    <IconButton
                        type="submit"
                        sx={{ p: 2 }}
                        aria-label="search"
                        onClick={performSearch}
                    >
                        <SearchIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default SearchBar;
