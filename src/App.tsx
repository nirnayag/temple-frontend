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

import "./i18n";
import theme from "./theme";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import DevoteesList from "./components/devotees/DevoteesList";
import EventsList from "./components/events/EventsList";
import EventDetail from "./components/events/EventDetail";
import DonationsList from "./components/donations/DonationsList";
import PriestsList from "./components/temple/PriestsList";
import PujaServices from "./components/temple/PujaServices";
import AboutTemple from "./components/temple/AboutTemple";
import UserDashboard from "./components/dashboard/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import DonatePage from "components/donations/DonatePage";
import ProfileEdit from "./components/profile/ProfileEdit";
import { AdminRoute } from "./components/auth/ProtectedRoute";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Navbar />

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventsList />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/about" element={<AboutTemple />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/priests" element={<PriestsList />} />
              <Route path="/services/puja" element={<PujaServices />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/profile" element={<Navigate to="/profile/edit" replace />} />
              <Route path="/profile/edit" element={<ProfileEdit />} />
              <Route path="/devotees" element={<DevoteesList />} />
              <Route path="/donations" element={<DonationsList />} />

              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

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
