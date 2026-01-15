import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ConfigProvider } from './context/ConfigContext';
import Home from './pages/Home';
import Course from './pages/Course';
import './index.css';

function App() {
    return (
        <ConfigProvider>
            <LanguageProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/course/:courseId" element={<Course />} />
                        </Routes>
                    </div>
                </Router>
            </LanguageProvider>
        </ConfigProvider>
    );
}

export default App;