import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useConfig } from '../context/ConfigContext';
import { exportExamsApi, downloadFileApi } from '../utils/api_calls';
import './ExportModal.css';

const ExportModal = ({ onClose }) => {
    const { t } = useLanguage();
    const { config } = useConfig();
    const [year, setYear] = useState('2026');
    const [sessionName, setSessionName] = useState('winter');
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);



    // Initialize checkboxes from collegiList
    const [collegi, setCollegi] = useState(() => {
        const initialCollegi = {};
        for (const key of config.collegiList) {
            initialCollegi[key] = false;
        }
        return initialCollegi;
    });

    // Load config from context on mount
    useEffect(() => {
        setYear(config.year.toString());
        setSessionName(config.name);
    }, [config]);

    const handleCheckboxChange = (key) => {
        setCollegi(prev => ({ ...prev, [key]: !prev[key] }));
        setError(null);
        setSuccessMessage(null);
    };


    const handleExport = async () => {
        setIsExporting(true);
        setError(null);
        setSuccessMessage(null);

        // Get selected collegi     
        const selectedCollegi = Object.keys(collegi).filter(key => collegi[key]);

        if (selectedCollegi.length === 0) {
            setError(t('noCollegiSelected'));
            setIsExporting(false);
            return;
        }

        try {
            // Step 1: Export exams
            const exportResponse = await exportExamsApi(year, sessionName, selectedCollegi);

            if (exportResponse.status === 'success' && exportResponse.filename) {
                setSuccessMessage(exportResponse.message);

                // Step 2: Download the file
                const blob = await downloadFileApi(exportResponse.filename);

                // Create a download link and trigger it
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = exportResponse.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                // Auto-close modal after a delay
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setError(t('exportFailed'));
            }
        } catch (err) {
            console.error('Error exporting exams:', err);
            setError(t('exportError') + ': ' + (err.response?.data?.detail || err.message));
        } finally {
            setIsExporting(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !isExporting) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{t('exportExams')}</h2>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        disabled={isExporting}
                    >
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {/* Session Configuration */}
                    <div className="setting-group">
                        <h3>{t('examSessionConfiguration')}</h3>
                        <div className="date-inputs">
                            <div className="input-group">
                                <label>{t('year')}</label>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="date-input"
                                    disabled={isExporting}
                                >
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>{t('sessionName')}</label>
                                <select
                                    value={sessionName}
                                    onChange={(e) => setSessionName(e.target.value)}
                                    className="date-input"
                                    disabled={isExporting}
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

                    {/* Collegi Selection */}
                    <div className="setting-group">
                        <h3>{t('selectCollegi')}</h3>

                        <div className="checkbox-grid">
                            {Object.keys(collegi).map(key => (
                                <label key={key} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={collegi[key]}
                                        onChange={() => handleCheckboxChange(key)}
                                        disabled={isExporting}
                                    />
                                    <span>{key}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="message error-message">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="message success-message">
                            {successMessage}
                        </div>
                    )}

                    {/* Export Button */}
                    <button
                        className="btn btn-export"
                        onClick={handleExport}
                        disabled={isExporting}
                        type="button"
                    >
                        {isExporting ? t('exporting') : t('export')}
                    </button>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={isExporting}
                    >
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
