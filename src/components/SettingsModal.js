import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useConfig } from '../context/ConfigContext';
import { reloadDatabaseApi } from '../utils/api_calls';
import './SettingsModal.css';

const SettingsModal = ({ onClose }) => {
    const { t } = useLanguage();
    const { config, updateConfig } = useConfig();
    const navigate = useNavigate();
    const [year, setYear] = useState('2026');
    const [sessionName, setSessionName] = useState('winter');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Load config from context on mount
    useEffect(() => {
        setYear(config.year.toString());
        setSessionName(config.name);
    }, [config]);

    const handleSave = async () => {
        // Reload database with selected year and session
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await reloadDatabaseApi(parseInt(year), sessionName);

            // Update config context on success
            updateConfig({ year: parseInt(year), name: sessionName });

            setSuccessMessage(response.message || 'Database reloaded successfully');

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


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !isLoading) {
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
                        disabled={isLoading}
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

                    <div className="message warning-message">
                        ⚠️ Saving will reload backend server. Ensure no other users are active.
                    </div>

                    {error && (
                        <div className="message error-message">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="message success-message">
                            {successMessage}
                            <p>Now Reloading the back-end....</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
                        {t('cancel')}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;