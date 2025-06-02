import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Import i18n configuration
import "./i18n";

// Theme
import theme from "./theme";

// Component imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import DevoteesList from "./components/devotees/DevoteesList";
import EventsList from "./components/events/EventsList";
import DonationsList from "./components/donations/DonationsList";
import PriestsList from "./components/temple/PriestsList";
import PujaServices from "./components/temple/PujaServices";
import AboutTemple from "./components/temple/AboutTemple";
import MobileOTPAuth from "./components/auth/MobileOTPAuth";
import UserDashboard from "./components/dashboard/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import {
  ProtectedRoute,
  AdminRoute,
  PublicRoute,
} from "./components/auth/ProtectedRoute";
import ProfileEdit from "./components/profile/ProfileEdit";
import CreateEventForm from "components/admin/CreateEventForm";
import AddDevoteeForm from "components/devotees/AddDevoteeForm";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Navbar />

          {/* Main content */}
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<MobileOTPAuth />} />
                <Route
                  path="/register"
                  element={<Navigate to="/login" replace />}
                />
              </Route>

              {/* Routes accessible to everyone */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventsList />} />
              <Route path="/about" element={<AboutTemple />} />
              <Route path="/priests" element={<PriestsList />} />
              <Route path="/services/puja" element={<PujaServices />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route
                  path="/profile"
                  element={<Navigate to="/profile/edit" replace />}
                />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/devotees" element={<DevoteesList />} />
                <Route path="/donations" element={<DonationsList />} />
              </Route>

              {/* Admin-only Routes */}
              <Route element={<AdminRoute />}>
                {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
                {/* THis below routes will be moved in Admin routes after development */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route
                  path="/admin/events/create"
                  element={<CreateEventForm />}
                />
                <Route
                  path="/admin/events/edit/:id"
                  element={<CreateEventForm />}
                />
                <Route
                  path="/admin/devotees/:id"
                  element={<AddDevoteeForm />}
                />
                {/* Thsese are devotee routes which has to be moved to admin route */}
                <Route
                  path="/admin/devotees/create"
                  element={<AddDevoteeForm />}
                />
              </Route>

              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>

          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
