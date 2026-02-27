import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useConfig } from '../context/ConfigContext';
import { reloadDatabaseApi, syncDatabaseApi, getLastSyncTimeApi } from '../utils/api_calls';
import './SettingsModal.css';

const SettingsModal = ({ onClose }) => {
    const { t } = useLanguage();
    const { config, updateConfig } = useConfig();
    const navigate = useNavigate();
    const [year, setYear] = useState('2026');
    const [sessionName, setSessionName] = useState('winter');
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState(null);
    const [syncError, setSyncError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [syncSuccessMessage, setSyncSuccessMessage] = useState(null);
    const [showOfferingsConfirm, setShowOfferingsConfirm] = useState(false);
    const [syncKeys, setSyncKeys] = useState({
        classrooms: false,
        courses: false,
        enrollments_dir: false,
        exam_groups: false,
        exams: false,
        offerings: false
    });

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
            const errorDetail = err.response?.data?.detail;
            let errorMessage = 'Failed to reload database';

            if (typeof errorDetail === 'string') {
                errorMessage = errorDetail;
            } else if (Array.isArray(errorDetail)) {
                errorMessage = errorDetail.map(e => e.msg || JSON.stringify(e)).join(', ');
            } else if (errorDetail && typeof errorDetail === 'object') {
                errorMessage = JSON.stringify(errorDetail);
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !isLoading && !isSyncing) {
            onClose();
        }
    };

    const handleCheckboxChange = (key) => {
        setSyncKeys(prev => ({ ...prev, [key]: !prev[key] }));
        setSyncError(null);
        setSyncSuccessMessage(null);
    };

    const handleCheckAll = () => {
        const allChecked = Object.values(syncKeys).every(v => v);
        const newValue = !allChecked;
        setSyncKeys({
            classrooms: newValue,
            courses: newValue,
            enrollments_dir: newValue,
            exam_groups: newValue,
            exams: newValue,
            offerings: newValue
        });
    };

    const handleSync = async () => {

        const selectedKeys = Object.entries(syncKeys)
            .filter(([_, checked]) => checked)
            .map(([key, _]) => key);

        if (selectedKeys.length === 0) {
            setSyncError('Please select at least one item to sync');
            return;
        }

        // Check if exams is checked but offerings is not
        if (syncKeys.exams && !syncKeys.offerings) {
            try {
                setIsLoading(true);
                setIsSyncing(true);
                setSyncError(null);
                setSyncSuccessMessage(null);
                const lastSyncData = await getLastSyncTimeApi('offerings');
                const lastSyncTime = lastSyncData.last_sync_time;

                // Check if lastSyncTime is null or more than a month ago
                let showWarning = false;

                if (!lastSyncTime) {
                    showWarning = true;
                } else {
                    const lastSync = new Date(lastSyncTime);
                    const now = new Date();
                    const monthAgo = new Date(now);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);

                    if (lastSync < monthAgo) {
                        showWarning = true;
                    }
                }

                if (showWarning) {
                    setShowOfferingsConfirm(true);
                    setIsLoading(false);
                    setIsSyncing(false);
                    // Stop here and wait for user confirmation before proceeding with sync
                    return;
                }
            } catch (err) {
                console.error('Error checking last sync time:', err);
                // Continue with sync even if we can't check the last sync time
            }
        }

        // Proceed with sync
        await performSync(selectedKeys);
    };

    const performSync = async (selectedKeys) => {
        setIsLoading(true);
        setIsSyncing(true);
        setSyncError(null);
        setSyncSuccessMessage(null);

        try {
            const response = await syncDatabaseApi(selectedKeys);
            setSyncSuccessMessage(response.message || t('syncSuccess'));

            // Reset checkboxes after successful sync
            setTimeout(() => {
                setSyncKeys({
                    classrooms: false,
                    courses: false,
                    enrollments_dir: false,
                    exam_groups: false,
                    exams: false,
                    offerings: false
                });
                navigate('/');
                window.location.reload();
            }, 2500);
        } catch (err) {
            const errorDetail = err.response?.data?.detail;
            let errorMessage = 'Failed to sync database';

            if (typeof errorDetail === 'string') {
                errorMessage = errorDetail;
            } else if (Array.isArray(errorDetail)) {
                errorMessage = errorDetail.map(e => e.msg || JSON.stringify(e)).join(', ');
            } else if (errorDetail && typeof errorDetail === 'object') {
                errorMessage = JSON.stringify(errorDetail);
            }

            setSyncError(errorMessage);
        } finally {
            setIsSyncing(false);
            setIsLoading(false);
        }
    };

    const handleSyncWithoutOfferings = async () => {
        setShowOfferingsConfirm(false);
        const selectedKeys = Object.entries(syncKeys)
            .filter(([_, checked]) => checked)
            .map(([key, _]) => key);
        await performSync(selectedKeys);
    };

    const handleSyncWithOfferings = async () => {
        setShowOfferingsConfirm(false);
        // Add offerings to the sync keys
        const selectedKeys = Object.entries(syncKeys)
            .filter(([_, checked]) => checked)
            .map(([key, _]) => key);
        selectedKeys.push('offerings');
        await performSync(selectedKeys);
    };


    return (
        <>
            {/* Offerings Confirmation Modal */}
            {showOfferingsConfirm && (
                <div className="modal-overlay" style={{ zIndex: 1001 }}>
                    <div className="modal-content" style={{ maxWidth: '450px' }}>
                        <div className="modal-header">
                            <h2>⚠️ {t('settings')}</h2>
                        </div>
                        <div className="modal-body">
                            <div className="message warning-message">
                                {t('offeringsOutdatedWarning')}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={handleSyncWithoutOfferings}
                                disabled={isLoading || isSyncing}
                            >
                                {t('syncWithoutOfferings')}
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSyncWithOfferings}
                                disabled={isLoading || isSyncing}
                            >
                                {t('syncWithOfferings')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="modal-overlay" onClick={handleOverlayClick}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{t('settings')}</h2>
                        <button
                            className="close-btn"
                            onClick={onClose}
                            disabled={isLoading || isSyncing}
                        >
                            ×
                        </button>
                    </div>

                    <div className="modal-body">
                        {/* Config Section */}
                        <div className="setting-group">
                            <h3>{t('examSessionConfiguration')}</h3>
                            <div className="date-inputs">
                                <div className="input-group">
                                    <label>{t('year')}</label>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="date-input"
                                        disabled={isLoading}
                                    >
                                        <option value="2024">2024</option>
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
                            ⚠️ {t('configWarning')}
                        </div>

                        {error && (
                            <div className="message error-message">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="message success-message">
                                {successMessage}
                                <p>{t('reloadingBackend')}</p>
                            </div>
                        )}

                        {/* Sync Section */}
                        <div className="setting-group sync-section">
                            <h3>{t('syncDatabaseTitle')}</h3>

                            <div className="message warning-message">
                                ℹ️ {t('syncWarning')}
                            </div>

                            <div className="checkbox-grid">
                                {Object.keys(syncKeys).map(key => (
                                    <label key={key} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={syncKeys[key]}
                                            onChange={() => handleCheckboxChange(key)}
                                            disabled={isLoading || isSyncing}
                                        />
                                        <span>{key.replace('_', ' ')}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="sync-controls">
                                <button
                                    className="btn btn-check-all"
                                    onClick={handleCheckAll}
                                    disabled={isLoading || isSyncing}
                                    type="button"
                                >
                                    {Object.values(syncKeys).every(v => v) ? t('uncheckAll') : t('checkAll')}
                                </button>
                            </div>

                            {syncError && (
                                <div className="message error-message">
                                    {syncError}
                                </div>
                            )}

                            {syncSuccessMessage && (
                                <div className="message success-message">
                                    {syncSuccessMessage}
                                </div>
                            )}

                            <button
                                className="btn btn-sync"
                                onClick={handleSync}
                                disabled={isLoading || isSyncing}
                                type="button"
                            >
                                {isSyncing ? t('syncing') : t('sync')}
                            </button>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose} disabled={isLoading || isSyncing}>
                            {t('cancel')}
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={isLoading || isSyncing}
                        >
                            {isLoading || isSyncing ? 'Loading...' : t('save')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsModal;