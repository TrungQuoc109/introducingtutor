import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInSide from "./pages/login";
import SignUp from "./pages/signup";
import HomePage from "./pages/home";
import VerifyPage from "./pages/verifyOTP";
import TutorPage from "./pages/tutor";
import Profile from "./pages/profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/login" element={<SignInSide />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/tutor" element={<TutorPage />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
