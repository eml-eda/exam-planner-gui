import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import Course from './pages/Course';
import './index.css';

const SESSION_CONFIG_KEY = 'exam-session-config';

function App() {
    const [databaseReady, setDatabaseReady] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize session config with defaults if not exists
        const initializeSessionConfig = () => {
            const saved = localStorage.getItem(SESSION_CONFIG_KEY);
            if (!saved) {
                const defaultConfig = { year: 2026, sessionName: 'Winter' };
                localStorage.setItem(SESSION_CONFIG_KEY, JSON.stringify(defaultConfig));
                console.log('Initialized default session config:', defaultConfig);
            }
        };

        initializeSessionConfig();
        setDatabaseReady(true);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="container flex justify-center align-center" style={{ minHeight: '100vh' }}>
                <div className="glass p-3 text-center">
                    <h2>Loading Exam Scheduler...</h2>
                    <p className="mt-2">Initializing database and loading course data...</p>
                </div>
            </div>
        );
    }

    if (!databaseReady) {
        return (
            <div className="container flex justify-center align-center" style={{ minHeight: '100vh' }}>
                <div className="glass p-3 text-center">
                    <h2>Database Error</h2>
                    <p className="mt-2">Failed to initialize the application database.</p>
                </div>
            </div>
        );
    }

    return (
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
    );
}

export default App;