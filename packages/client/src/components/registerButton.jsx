// RegisterButton.js
import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { baseURL } from "../config/config";
import { useNavigate } from "react-router-dom";

const RegisterButton = ({ courseId, price }) => {
    const [openDialog, setOpenDialog] = useState(false);

    // Hàm để mở dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Hàm để đóng dialog, `confirmed` là true khi người dùng xác nhận đăng ký
    const handleCloseDialog = (confirmed) => {
        setOpenDialog(false);

        // Nếu người dùng xác nhận, tiếp tục với việc đăng ký
        if (confirmed) {
            registerCourse();
        }
    };
    const registerCourse = async () => {
        const toekn = localStorage.getItem("token");

        try {
            const response = await fetch(`${baseURL}/student/register-course`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${toekn}`,
                },
                body: JSON.stringify({
                    courseId: courseId,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                if (data.data.resultCode == 0 && data.data.payUrl) {
                    window.location.href = data.data.payUrl;
                }
            } else {
                // Xử lý lỗi từ response
                alert(data.error);
            }
        } catch (error) {
            console.error("Đã xảy ra lỗi:", error);
            alert("Có lỗi xảy ra. Vui lòng kiểm tra lại.");
        }
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={(event) => {
                    event.stopPropagation();
                    handleOpenDialog();
                }}
            >
                Giá: {price}
            </Button>
            <Dialog
                open={openDialog}
                onClose={(event) => {
                    handleCloseDialog(false);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Xác nhận đăng ký khóa học"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn đăng ký khóa học này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => handleCloseDialog(false)}
                        color="primary"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={() => handleCloseDialog(true)}
                        color="primary"
                        autoFocus
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default RegisterButton;
