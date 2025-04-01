import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
