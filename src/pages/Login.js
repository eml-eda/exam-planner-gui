import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const { t, isEnglish, toggleLanguage } = useLanguage();
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Redirect to home if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

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
                navigate('/');
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

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-title">
                        📚 {t('exam_sched')}
                    </h1>
                    <button
                        className="language-toggle"
                        onClick={toggleLanguage}
                        title={isEnglish ? 'Switch to Italian' : 'Passa all\'Inglese'}
                    >
                        {isEnglish ? '🇮🇹 IT' : '🇬🇧 EN'}
                    </button>
                </div>

                <div className="login-card">
                    <h2 className="login-card-title">{t('login')}</h2>

                    <form onSubmit={handleLogin}>
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
                                autoFocus
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
                            <li><strong>viewer</strong> - {t('readOnlyAccess')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
