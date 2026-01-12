import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SearchComponent from '../components/SearchComponent';
import SettingsModal from '../components/SettingsModal';
import './Home.css';
import { initializeCourses, clearCoursesCache } from '../utils/database';

const Home = () => {
    const { isEnglish, toggleLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [showSettings, setShowSettings] = useState(false);
    const [searching, setSearching] = useState(false);
    const [settingsHover, setSettingsHover] = useState(false);
    const [backHover, setBackHover] = useState(false);
    const [locked, setlocked] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [backendError, setBackendError] = useState(false);

    useEffect(() => {
        // clearCoursesCache();    // Uncomment for restarting course cache 
        const loadCourses = async () => {
            try {
                setLoadingCourses(true);
                await initializeCourses();
                console.log('Courses data loaded');
            } catch (error) {
                setBackendError(true);
                console.error('Error preloading courses data:', error);
            } finally {
                setLoadingCourses(false);
            }
        };

        loadCourses();
    }, []);

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        }
    };

    const canGoBack = window.history.length > 1 && location.pathname !== '/';

    return (
        <div className="home-container">
            {/* Top Navigation */}
            <div className="top-nav">
                {/* Left side buttons */}
                <div className="nav-left">
                    {/* Back Button */}
                    {canGoBack && (
                        <button
                            className={`nav-btn back-btn ${backHover ? 'expanded' : ''}`}
                            onMouseEnter={() => setBackHover(true)}
                            onMouseLeave={() => setBackHover(false)}
                            onClick={handleBack}
                        >
                            <span className="btn-icon">←</span>
                            <span className="btn-text">{t('back')}</span>
                        </button>
                    )}


                    {/* Language Toggle */}
                    <button
                        className="nav-btn language-btn"
                        onClick={toggleLanguage}
                    >
                        {isEnglish ? t('english') : t('italian')}
                    </button>

                    {/* Settings Button */}
                    <button
                        className={`nav-btn settings-btn ${settingsHover ? 'expanded' : ''}`}
                        onMouseEnter={() => setSettingsHover(true)}
                        onMouseLeave={() => setSettingsHover(false)}
                        onClick={() => setShowSettings(true)}
                    >
                        <span className="btn-icon">⚙️</span>
                        <span className="btn-text">{t('config')}</span>
                    </button>
                </div>

                {/* Right side buttons */}
                <div className="nav-right">
                    {/* Loading Indicator */}
                    {loadingCourses && (
                        <div className="loading-indicator">
                            <span className="loading-icon">⟳</span>
                            <span className="loading-text">{t('loading_courses')}</span>
                        </div>
                    )}

                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className={`search-container ${searching ? 'searching' : ''}`} onClick={() => { setSearching(true) }} onBlur={() => { if (!locked) setSearching(false) }}>
                    <SearchComponent setlocked={setlocked} isDisabled={loadingCourses} />
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <SettingsModal
                    onClose={() => setShowSettings(false)}
                />
            )}

            {/* Backend Error Modal */}
            {backendError && (
                <div className="error-modal-overlay">
                    <div className="error-modal">
                        <div className="error-icon">⚠️</div>
                        <h2 className="error-title">{t('error')}</h2>
                        <p className="error-message">
                            {t('backend_error_message')}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;