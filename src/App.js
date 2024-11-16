import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Billing from './Billing';
import EMR from './EMR';
import Registration from './Registration';
import Scheduling from './Scheduling';
import Staff from './Staff';
import Login from './Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      {/* Pass setIsAuthenticated to Navbar */}
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emr"
          element={
            <ProtectedRoute>
              <EMR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registration"
          element={
            <ProtectedRoute>
              <Registration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scheduling"
          element={
            <ProtectedRoute>
              <Scheduling />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <Staff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
