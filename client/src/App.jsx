import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import LoadingSpinner from "./components/LoadingSpinner";

import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import { useAuthStore } from "./store/authStore";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user.isVerified) return <Navigate to="/verify-email" replace />;

  return children;
};

// Redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex flex-col relative overflow-hidden">
      <Navbar />
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          {/* Fallback route */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      <Toaster />
    </div>
  );
}

export default App;
