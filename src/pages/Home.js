import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SearchComponent from '../components/SearchComponent';
import SettingsModal from '../components/SettingsModal';
import './Home.css';
import { initializeCourses } from '../utils/database';
import { reloadCachesApi } from '../utils/api_calls';
import { useConfig } from '../context/ConfigContext';
import { getRecentCourses } from '../utils/recentCourses';


const Home = () => {
    const { isEnglish, toggleLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [showSettings, setShowSettings] = useState(false);
    const { config, checkConfigUneq, forceRefreshPage } = useConfig();

    // Format timestamp from ISO format to "HH:MM:SS DD/MM"
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return null;
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${hours}:${minutes}:${seconds} ${day}/${month}`;
    };
    const [searching, setSearching] = useState(false);
    const [settingsHover, setSettingsHover] = useState(false);
    const [backHover, setBackHover] = useState(false);
    const [locked, setlocked] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [backendError, setBackendError] = useState(false);
    const [backendConfigError, setBackendConfigError] = useState(false);
    const [fetchType, setFetchType] = useState(null);
    const [fetchTime, setFetchTime] = useState(null);
    const [recentCourses, setRecentCourses] = useState([]);


    const loadCourses = useCallback(async () => {
        try {
            setLoadingCourses(true);
            const result = await initializeCourses();
            const fetchTimeValue = result.courses.timestamp || null;
            const fetchTypeValue = result.fetch_type || 'unknown';
            setFetchType(fetchTypeValue);
            setFetchTime(fetchTimeValue);
            console.log('Courses data loaded');
        } catch (error) {
            setBackendError(true);
            console.error('Error preloading courses data:', error);
        } finally {
            setLoadingCourses(false);
        }
    }, []);


    const handleRefresh = async () => {
        try {
            setLoadingCourses(true);
            if (await checkConfigUneq()) {
                setBackendConfigError(true);
                forceRefreshPage();
                return;
            }
            await reloadCachesApi();
            await loadCourses();
        } catch (error) {
            setBackendError(true);
            console.error('Error refreshing courses:', error);
            setLoadingCourses(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    useEffect(() => {
        // Load recently viewed courses from localStorage
        const courses = getRecentCourses();
        setRecentCourses(courses);
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
                    <div className="language-toggle">
                        <button
                            className={`language-option ${!isEnglish ? 'active' : ''}`}
                            onClick={() => !isEnglish || toggleLanguage()}
                        >
                            IT
                        </button>
                        <button
                            className={`language-option ${isEnglish ? 'active' : ''}`}
                            onClick={() => isEnglish || toggleLanguage()}
                        >
                            EN
                        </button>
                        <div className={`language-slider ${isEnglish ? 'en' : 'it'}`}></div>
                    </div>


                    {/* Settings Button */}
                    <button
                        className={`nav-btn settings-btn ${settingsHover ? 'expanded' : ''}`}
                        onMouseEnter={() => setSettingsHover(true)}
                        onMouseLeave={() => setSettingsHover(false)}
                        onClick={() => setShowSettings(true)}
                    >
                        <span className="btn-icon">⚙️</span>
                        <span className="btn-text">{t('settings')}</span>
                    </button>
                </div>

                {/* Middle text */}
                <div className="nav-middle">
                    <h2 className="page-title">{t('exam_data')} {t('year')} {config?.year} {t('session')} {config?.name}</h2>
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

                    {/* Fetch Type Indicator */}
                    {!loadingCourses && fetchType && (
                        <div className="fetch-container">
                            <div
                                className={`fetch-indicator ${fetchType}`}
                                title={fetchType === 'from-cache' ? t('courses') + ' ' + t('dataFromCache') + (fetchTime ? ` (${formatTimestamp(fetchTime)})` : '') : t('courses') + ' ' + t('freshlyQueriedData') + (fetchTime ? ` (${formatTimestamp(fetchTime)})` : '')}
                            ></div>
                            <p className="fetch-details">
                                {fetchType === 'from-cache' ? t('courses') + ' ' + t('cached') : t('courses') + ' ' + t('fresh')}
                                {fetchTime && <><br />{formatTimestamp(fetchTime)}</>}
                            </p>
                        </div>
                    )}

                    {/* Refresh Button */}
                    {!loadingCourses && (
                        <button
                            className="nav-btn refresh-btn"
                            onClick={handleRefresh}
                        >
                            <span className="btn-icon">↻</span>
                            <span className="refresh-tooltip">{t('refreshTextCourse')}</span>
                        </button>
                    )}

                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className={`search-container`} >
                    <div className={`search-comp ${searching ? 'searching' : ''}`} onClick={() => { setSearching(true) }} onBlur={() => { if (!locked) setSearching(false) }}>
                        <SearchComponent setlocked={setlocked} isDisabled={loadingCourses} />
                    </div>
                    {recentCourses.length > 0 && (
                        <div className={`recently-searched ${searching ? 'searching' : ''}`}>
                            <h3 className='recently-searched-title'>{t('recently_searched')}</h3>
                            <div className="recent-courses-grid">
                                {recentCourses.map((course) => (
                                    <div
                                        key={course.code}
                                        className={`recent-course-card ${loadingCourses ? 'disabled' : ''}`}
                                        onClick={() => !loadingCourses && navigate(`/course/${course.code}`)}
                                    >
                                        <div className="recent-course-header">
                                            <p className="recent-course-title">{course.title} ({course.code})</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <SettingsModal
                    onClose={() => setShowSettings(false)}
                />
            )}

            {/* Backend Error Loading Modal */}
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

            {/* Backend Error Config Modal */}
            {backendConfigError && (
                <div className="error-modal-overlay">
                    <div className="error-modal">
                        <div className="error-icon">⚠️</div>
                        <h2 className="error-title">{t('error')}</h2>
                        <p className="error-message">
                            {t('backend_error_config_message')}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;