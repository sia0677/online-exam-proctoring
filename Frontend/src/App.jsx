import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/Chatbot";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Intro from "./pages/Intro";
import Exams from "./pages/Exams";
import Students from "./pages/Students";
import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";
import Leaderboard from "./pages/Leaderboard";
import Community from "./pages/Community";
import ExamTaker from "./pages/ExamTaker";
import Games from "./pages/Games";
import CreateExam from "./pages/CreateExam";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div
          style={{
            minHeight: "100vh",
            background: "var(--bg-color)",
            color: "var(--text-main)",
          }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Intro />} />

            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route path="/exams" element={<Exams />} />

              <Route
                path="/exam/:examId"
                element={<ExamTaker />}
              />

              <Route
                path="/students"
                element={<Students />}
              />

              <Route
                path="/schedule"
                element={<Schedule />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />

              <Route
                path="/leaderboard"
                element={<Leaderboard />}
              />

              <Route
                path="/community"
                element={<Community />}
              />

              <Route
                path="/games"
                element={<Games />}
              />

              <Route
                path="/create-exam"
                element={<CreateExam />}
              />
            </Route>

            {/* Navbar Route */}
            <Route
              path="/navbar"
              element={<Navbar />}
            />

            {/* Redirect Unknown Routes */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>

          {/* Background Overlay */}
          <div className="themed-bg-overlay"></div>

          {/* AI Chatbot */}
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;