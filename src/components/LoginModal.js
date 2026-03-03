import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

const LoginModal = ({ onClose }) => {
    const { t } = useLanguage();
    const { login, logout, user } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setError(null);

        if (!username || !password) {
            setError(t('credentialsRequired'));
            setIsLoggingIn(false);
            return;
        }

        try {
            const result = await login(username, password, rememberMe);
            if (result.success) {
                onClose();
            } else {
                setError(result.error || t('invalidCredentials'));
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(t('loginError'));
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !isLoggingIn) {
            onClose();
        }
    };

    const handleLogout = () => {
        logout();
        setUsername('');
        setPassword('');
        setError(null);
        setTimeout(() => {
            navigate('/');
            window.location.reload();
        }, 500);
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content login-modal">
                <div className="modal-header">
                    <h2>{t('login')}</h2>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        disabled={isLoggingIn}
                    >
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <form onSubmit={handleLogin}>
                        <div className="current-user-info">
                            <p className="current-user-label">{t('currentUser')}:</p>
                            <p className="current-user-name">{user?.username}</p>
                            <button
                                type="button"
                                className="btn btn-logout"
                                onClick={handleLogout}
                                disabled={isLoggingIn}
                            >
                                {t('logout')}
                            </button>
                        </div>

                        <div className="input-group">
                            <label htmlFor="username">{t('username')}</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="login-input"
                                disabled={isLoggingIn}
                                placeholder={t('enterUsername')}
                                autoComplete="username"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">{t('password')}</label>
                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="login-input password-input"
                                    disabled={isLoggingIn}
                                    placeholder={t('enterPassword')}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoggingIn}
                                    title={showPassword ? t('hidePassword') : t('showPassword')}
                                >
                                    {showPassword ? '🔒' : '👀'}
                                </button>
                            </div>
                        </div>

                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isLoggingIn}
                                />
                                <span>{t('rememberMe')}</span>
                            </label>
                        </div>

                        {error && (
                            <div className="message error-message">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-login"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? t('loggingIn') : t('loginButton')}
                        </button>
                    </form>

                    <div className="login-info">
                        <p className="info-title">{t('availableAccounts')}:</p>
                        <ul className="accounts-list">
                            <li><strong>admin</strong> - {t('fullAccess')}</li>
                            <li><strong>editor</strong> - {t('editAccess')}</li>
                            <li><strong>viewer</strong> - {t('readOnlyAccess')} ({t('default')})</li>
                        </ul>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={isLoggingIn}
                    >
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
