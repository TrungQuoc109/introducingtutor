import React, { useState } from "react";
import { Typography, TextField, Button, Paper } from "@mui/material";

function SalaryCalculation() {
    const [hoursWorked, setHoursWorked] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [salary, setSalary] = useState(null);

    const calculateSalary = () => {
        const salary = parseFloat(hoursWorked) * parseFloat(hourlyRate);
        setSalary(salary);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Calculate Salary
            </Typography>
            <Paper sx={{ p: 2 }}>
                <TextField
                    label="Hours Worked"
                    type="number"
                    value={hoursWorked}
                    onChange={(e) => setHoursWorked(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Hourly Rate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={calculateSalary}
                >
                    Calculate
                </Button>
                {salary !== null && (
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Total Salary: ${salary.toFixed(2)}
                    </Typography>
                )}
            </Paper>
        </div>
    );
}

export default SalaryCalculation;
