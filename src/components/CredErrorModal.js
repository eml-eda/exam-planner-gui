import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './CredErrorModal.css';

const CredErrorModal = ({
    isOpen,
    onClose,
    error = null,
    showLoginButton = false,
    onLoginClick = null,
    showHomeButton = false
}) => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    if (!isOpen) return null;

    // Determine error type and message
    const getErrorDetails = () => {
        if (!error) {
            return {
                icon: '⚠️',
                message: t('backend_error_message'),
                type: 'general'
            };
        }

        const status = error.response?.status;
        const detail = error.response?.data?.detail;

        if (status === 401) {
            return {
                icon: '🔒',
                message: detail || t('authenticationRequired'),
                type: 'auth'
            };
        } else if (status === 403) {
            return {
                icon: '🔒',
                message: detail || t('permissionDenied'),
                type: 'permission'
            };
        } else if (error.message) {
            return {
                icon: '⚠️',
                message: error.message,
                type: 'general'
            };
        } else {
            return {
                icon: '⚠️',
                message: detail || t('backend_error_message'),
                type: 'general'
            };
        }
    };

    const errorDetails = getErrorDetails();
    const isAuthError = errorDetails.type === 'auth' || errorDetails.type === 'permission';

    const handleLoginClick = () => {
        onClose();
        if (onLoginClick) {
            onLoginClick();
        }
    };

    const handleHomeClick = () => {
        onClose();
        navigate('/');
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="error-modal-overlay" onClick={handleOverlayClick}>
            <div className="error-modal" onClick={(e) => e.stopPropagation()}>
                <div className="error-icon">{errorDetails.icon}</div>
                <h2 className="error-title">{t('error')}</h2>
                <p className="error-message">{errorDetails.message}</p>

                <div className="error-modal-actions">
                    {isAuthError && showLoginButton && (
                        <button
                            className="btn btn-login-error"
                            onClick={handleLoginClick}
                        >
                            {t('loginButton')}
                        </button>
                    )}

                    {isAuthError && showHomeButton && (
                        <button
                            className="btn btn-login-error"
                            onClick={handleHomeClick}
                        >
                            {t('goToHome')}
                        </button>
                    )}

                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CredErrorModal;
