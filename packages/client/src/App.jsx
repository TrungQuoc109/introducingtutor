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
import Dashboard from "./pages/admin/dashboard";
import UserManagement from "./pages/admin/manageUser";
import CourseManagement from "./pages/admin/manageCourse";
import SalaryCalculation from "./pages/admin/calculateSalary";
import AboutUs from "./pages/aboutUs";
import ForgotPasswordPage from "./pages/forgotPassword";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<SignInSide />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/tutor" element={<TutorPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-course" element={<MyCourse />} />
                <Route path="/course" element={<CoursePage />} />
                <Route path="/tutor-detail" element={<TutorDetail />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                />
                <Route
                    path="/course-detail/:courseId"
                    element={<CourseDetail />}
                />
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route path="users" element={<UserManagement />} />
                    <Route path="courses" element={<CourseManagement />} />
                    <Route path="salary" element={<SalaryCalculation />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
