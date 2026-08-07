import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import Home from './pages/Home';
import Course from './pages/Course';
import Login from './pages/Login';
import Agent from './pages/Agent';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <ConfigProvider>
                    <LanguageProvider>
                        <div className="App">
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route 
                                    path="/" 
                                    element={
                                        <ProtectedRoute>
                                            <Home />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/course/:courseId" 
                                    element={
                                        <ProtectedRoute>
                                            <Course />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route
                                    path="/agent"
                                    element={
                                        <ProtectedRoute>
                                            <Agent />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </div>
                    </LanguageProvider>
                </ConfigProvider>
            </AuthProvider>
        </Router >
    );
}

export default App;