import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './SettingsModal.css';

const SettingsModal = ({ onClose }) => {
    const { t } = useLanguage();
    const [startDate, setStartDate] = useState('2026-01-01');
    const [endDate, setEndDate] = useState('2026-02-28');

    const handleSave = () => {
        // Save settings to localStorage or context
        localStorage.setItem('examDateRange', JSON.stringify({
            startDate,
            endDate
        }));
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{t('settings')}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="setting-group">
                        <h3>{t('examDateRange')}</h3>
                        <div className="date-inputs">
                            <div className="input-group">
                                <label>{t('startDate')}</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="date-input"
                                />
                            </div>
                            <div className="input-group">
                                <label>{t('endDate')}</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="date-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        {t('cancel')}
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        {t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;