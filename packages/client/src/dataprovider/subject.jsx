import React, { createContext, useState, useEffect } from "react";
import { baseURL } from "../config/config";

// Khởi tạo Context với giá trị mặc định là null hoặc một đối tượng cụ thể nếu bạn muốn
export const DataContext = createContext(null);

// Export named thay vì default
export const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`${baseURL}/user/get-subject`)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
            .catch((error) => console.error(error));
    }, []);

    return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};
