import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { initializeDatabase } from './utils/simpleDatabase';
import Home from './pages/Home';
import Course from './pages/Course';
import './index.css';

function App() {
    const [databaseReady, setDatabaseReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initDb = async () => {
            try {
                setLoading(true);
                await initializeDatabase();
                setDatabaseReady(true);
                setError(null);
            } catch (err) {
                console.error('Failed to initialize database:', err);
                setError('Failed to load application data. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };

        initDb();
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

    if (error) {
        return (
            <div className="container flex justify-center align-center" style={{ minHeight: '100vh' }}>
                <div className="glass p-3 text-center">
                    <h2>Error</h2>
                    <p className="mt-2">{error}</p>
                    <button
                        className="btn btn-glass mt-2"
                        onClick={() => window.location.reload()}
                    >
                        Refresh Page
                    </button>
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