import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInSide from "./pages/login";
import SignUp from "./pages/signup";
import HomePage from "./pages/home";
import VerifyPage from "./pages/verifyOTP";
import TutorPage from "./pages/tutor";
import Profile from "./pages/profile";
import MyCourse from "./pages/myCourse";
import CoursePage from "./pages/coures";
import TutorDetail from "./pages/tutorDetail";
import CourseDetail from "./pages/courseDetail";

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
                <Route path="/my-course" element={<MyCourse />} />
                <Route path="/course" element={<CoursePage />} />
                <Route path="/tutor-detail" element={<TutorDetail />} />
                <Route
                    path="/course-detail/:courseId"
                    element={<CourseDetail />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
