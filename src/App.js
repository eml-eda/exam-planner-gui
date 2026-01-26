import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ConfigProvider } from './context/ConfigContext';
import Home from './pages/Home';
import Course from './pages/Course';
import './index.css';

function App() {
    return (
        <Router>
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
        </Router >
    );
}

export default App;