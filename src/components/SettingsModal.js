import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { reloadDatabaseApi } from '../utils/api_calls';
import { refreshCoursesFromApi } from '../utils/database';
import './SettingsModal.css';


const SESSION_CONFIG_KEY = 'exam-session-config';

// Get config from localStorage or return defaults
const getSessionConfig = () => {
    try {
        const saved = localStorage.getItem(SESSION_CONFIG_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error reading session config from localStorage:', error);
    }
    return { year: 2026, sessionName: 'Winter' };
};

// Save config to localStorage
const saveSessionConfig = (year, sessionName) => {
    try {
        localStorage.setItem(SESSION_CONFIG_KEY, JSON.stringify({ year, sessionName }));
    } catch (error) {
        console.error('Error saving session config to localStorage:', error);
    }
};

const SettingsModal = ({ onClose }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [year, setYear] = useState('2026');
    const [sessionName, setSessionName] = useState('winter');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshingCourses, setIsRefreshingCourses] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Load config from localStorage on mount
    useEffect(() => {
        const config = getSessionConfig();
        setYear(config.year);
        setSessionName(config.sessionName);
    }, []);

    const handleSave = async () => {
        // Reload database with selected year and session
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await reloadDatabaseApi(parseInt(year), sessionName);

            // Save config to localStorage on success
            saveSessionConfig(year, sessionName);

            setSuccessMessage(response.message || 'Database reloaded successfully');

            await refreshCoursesFromApi();

            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 500);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to reload database');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefreshCourses = async () => {
        setIsRefreshingCourses(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await refreshCoursesFromApi();
            setSuccessMessage('Courses refreshed successfully');
            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 500);
        } catch (err) {
            setError('Failed to refresh courses');
        } finally {
            setIsRefreshingCourses(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !isRefreshingCourses && !isLoading) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{t('settings')}</h2>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        disabled={isRefreshingCourses || isLoading}
                    >
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <div className="setting-group">
                        <h3>Exam Session Configuration</h3>
                        <div className="date-inputs">
                            <div className="input-group">
                                <label>Year</label>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="date-input"
                                    disabled={isLoading}
                                >
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Session Name</label>
                                <select
                                    value={sessionName}
                                    onChange={(e) => setSessionName(e.target.value)}
                                    className="date-input"
                                    disabled={isLoading}
                                >
                                    <option value="winter">Winter</option>
                                    <option value="spring-bachelor">Spring Bachelor</option>
                                    <option value="summer">Summer</option>
                                    <option value="autumn">Autumn</option>
                                    <option value="autumn-bachelor">Autumn Bachelor</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="setting-group">
                        <h3>Courses Cache</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                            Refresh courses data from the server
                        </p>
                        <button
                            className="btn btn-refresh"
                            onClick={handleRefreshCourses}
                            disabled={isRefreshingCourses || isLoading}
                        >
                            {isRefreshingCourses ? '🔄 Refreshing...' : '🔄 Refresh Courses'}
                        </button>
                    </div>

                    {error && (
                        <div className="message error-message">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="message success-message">
                            {successMessage}
                            <p>Now Reloading the courses....</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose} disabled={isLoading || isRefreshingCourses}>
                        {t('cancel')}
                    </button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Loading...' : t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export { getSessionConfig, saveSessionConfig };
export default SettingsModal;