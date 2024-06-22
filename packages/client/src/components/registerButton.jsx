// RegisterButton.js
import React from "react";
import { Button } from "@mui/material";
import { baseURL } from "../config/config";
import { useNavigate } from "react-router-dom";

const RegisterButton = ({ courseId, price }) => {
    const registerCourse = async () => {
        const toekn = localStorage.getItem("token");
        console.log(courseId, price);
        // try {
        //     const response = await fetch(`${baseURL}/student/payment`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${toekn}`,
        //         },
        //         body: JSON.stringify({
        //             courseId: courseId,
        //         }),
        //     });

        //     if (response.ok) {
        //         const data = await response.json();

        //         //  console.log(data.data);
        //         if (data.data.resultCode == 0 && data.data.payUrl) {
        //             console.log(data.data.payUrl);
        //             window.location.href = data.data.payUrl;
        //         }
        //     } else {
        //         // Xử lý lỗi từ response
        //         alert("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
        //     }
        // } catch (error) {
        //     console.error("Đã xảy ra lỗi:", error);
        //     alert("Có lỗi xảy ra. Vui lòng kiểm tra lại.");
        // }
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
                event.stopPropagation();
                registerCourse();
            }}
        >
            Giá: {price}
        </Button>
    );
};

export default RegisterButton;
