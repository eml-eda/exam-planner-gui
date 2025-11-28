import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SearchComponent from '../components/SearchComponent';
import SettingsModal from '../components/SettingsModal';
import './Home.css';

const Home = () => {
    const { isEnglish, toggleLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [showSettings, setShowSettings] = useState(false);
    const [searching, setSearching] = useState(false);
    const [settingsHover, setSettingsHover] = useState(false);
    const [backHover, setBackHover] = useState(false);

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

                {/* Right side buttons */}
                <div className="nav-right">
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
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className={`search-container ${searching ? 'searching' : ''}`} onClick={() => { setSearching(true) }} onBlur={() => { setSearching(false) }}>
                    <SearchComponent />
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <SettingsModal
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
};

export default Home;