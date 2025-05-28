import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import SuperAdminLayout from "./layouts/SuperAdminLayout/SuperAdminLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Organizations from "./pages/Organizations/Organizations";
import Admins from "./pages/Admins/Admins";
import Jobs from "./pages/Jobs/Jobs";
import Applications from "./pages/Applications/Applications";
import Candidates from "./pages/Candidates/Candidates";
import Cookies from "js-cookie";

// Protected Route komponenti
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("user_token");
  return token ? children : <Navigate to="/login" replace />;
};

// Public Route komponenti (faqat login uchun)
const PublicRoute = ({ children }) => {
  const token = Cookies.get("user_token");
  return !token ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="admins" element={<Admins />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="applications" element={<Applications />} />
        <Route path="candidates" element={<Candidates />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
