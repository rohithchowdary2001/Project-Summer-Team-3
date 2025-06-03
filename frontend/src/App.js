import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import BookDetails from './components/BookDetails';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import AdminDashboard from './components/AdminDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a90e2',
    },
    secondary: {
      main: '#19857b',
    },
  },
});

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <>
                  <Navigation />
                  <Dashboard />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/books/add"
            element={
              <PrivateRoute>
                <>
                  <Navigation />
                  <AddBook />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/books/:id"
            element={
              <PrivateRoute>
                <>
                  <Navigation />
                  <BookDetails />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/books/:id/edit"
            element={
              <AdminRoute>
                <>
                  <Navigation />
                  <EditBook />
                </>
              </AdminRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <>
                  <Navigation />
                  <AdminDashboard />
                </>
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  );
}

export default App; 