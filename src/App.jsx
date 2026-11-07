import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./routes/Login";
import Register from "./routes/Register";
import Dashboard from "./routes/Dashboard";
import AdminDashboard from "./routes/AdminDashboard";
import Riders from "./routes/Riders";
import SmsLogs from "./routes/SmsLogs";
import IncidentLogs from "./routes/IncidentLogs";

import SmsScheduler from "./routes/SmsScheduler";

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <SmsScheduler />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/riders" element={<Riders />} />
        <Route path="/sms-logs" element={<SmsLogs />} />
        <Route path="/incident-logs" element={<IncidentLogs />} />

        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
