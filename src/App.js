import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import Home from './pages/Home';
import Course from './pages/Course';
import './index.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ConfigProvider>
                    <LanguageProvider>
                        <div className="App">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/course/:courseId" element={<Course />} />
                            </Routes>
                        </div>
                    </LanguageProvider>
                </ConfigProvider>
            </AuthProvider>
        </Router >
    );
}

export default App;