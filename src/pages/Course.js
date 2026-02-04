import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getCourseById } from '../utils/database';
import SearchComponent from '../components/SearchComponent';
import SettingsModal from '../components/SettingsModal';
import CalendarView from '../components/CalendarView';
import './Course.css';
import { getExamsApi, clearExamCacheApi } from '../utils/api_calls';
import { useConfig } from '../context/ConfigContext';

const Course = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { isEnglish, toggleLanguage, t } = useLanguage();
    const [course, setCourse] = useState(null);

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
    const { checkConfigUneq, forceRefreshPage } = useConfig();
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [settingsHover, setSettingsHover] = useState(false);
    const [backHover, setBackHover] = useState(false);
    const [showExams, setShowExams] = useState(true);
    const [showInfo, setShowInfo] = useState(true);
    const [apiLoading, setApiLoading] = useState(true);
    const [examConflicts, setExamConflicts] = useState([]);
    const [backendError, setBackendError] = useState(false);
    const [fetchType, setFetchType] = useState(null);
    const [fetchTime, setFetchTime] = useState(null);
    const [backendConfigError, setBackendConfigError] = useState(false);
    const [view, setView] = useState(null); // "full" or "compact" or "timed"
    const [sliderStyle, setSliderStyle] = useState({});
    const fullBtnRef = useRef(null);
    const compactBtnRef = useRef(null);
    const timedBtnRef = useRef(null);



    const updateSlider = useCallback(() => {
        console.log("Updating slider position for view:", view);
        const refs = {
            full: fullBtnRef.current,
            compact: compactBtnRef.current,
            timed: timedBtnRef.current
        };

        const activeBtn = refs[view];
        if (activeBtn) {
            const parent = activeBtn.parentElement;
            if (parent) {
                const parentRect = parent.getBoundingClientRect();
                const btnRect = activeBtn.getBoundingClientRect();
                const left = btnRect.left - parentRect.left;
                setSliderStyle({
                    left: `${left}px`,
                    width: `${btnRect.width}px`
                });
            }
        }
    }, [view]);


    const checkAndHandleConfig = useCallback(async () => {
        if (await checkConfigUneq()) {
            setBackendConfigError(true);
            forceRefreshPage();
            return;
        }
    }, [checkConfigUneq, forceRefreshPage]);

    const getExams = useCallback(async () => {
        try {
            setApiLoading(true);
            await checkAndHandleConfig();

            // Fetch from API (backend handles caching)
            console.log(`Fetching exam conflicts for course code ${courseId}`);
            const response = await getExamsApi(courseId);

            // Extract exams and fetch_type from response
            const data = response.exams.result || [];
            const fetchTimeValue = response.exams.timestamp || null;
            const fetchTypeValue = response.fetch_type || 'unknown';

            setExamConflicts(data);
            setFetchType(fetchTypeValue);
            setFetchTime(fetchTimeValue);
        } catch (error) {
            setBackendError(true);
            console.error('Error fetching exam conflicts:', error);
        } finally {
            setApiLoading(false);
        }
    }, [courseId, checkAndHandleConfig]);

    const handleRefreshExams = async () => {
        try {
            setApiLoading(true);
            await checkAndHandleConfig();
            await clearExamCacheApi(courseId);
            await getExams();
        } catch (error) {
            setBackendError(true);
            console.error('Error refreshing exams:', error);
            setApiLoading(false);
        }
    };

    useEffect(() => {
        const loadCourseData = async () => {
            try {
                await checkAndHandleConfig();
                setLoading(true);
                const courseData = await getCourseById(courseId);
                if (courseData) {
                    setCourse(courseData);
                }
            } catch (error) {
                setBackendError(true);
                console.error('Error loading course data:', error);
            } finally {
                setLoading(false);
            }
        };

        getExams();
        loadCourseData();
    }, [courseId, getExams, checkAndHandleConfig]);


    const handleBack = () => {
        navigate(-1);
    };

    // Update slider position and width when view changes
    useEffect(() => {
        updateSlider();
        // Also update on window resize
        window.addEventListener('resize', updateSlider);
        return () => window.removeEventListener('resize', updateSlider);
    }, [view, isEnglish, updateSlider]);

    if (loading) {
        return (
            <div className="container flex justify-center align-center" style={{ minHeight: '100vh' }}>
                <div className="glass p-3 text-center">
                    <h2>Loading Course Information...</h2>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container flex justify-center align-center" style={{ minHeight: '100vh' }}>
                <div className="glass p-3 text-center">
                    <h2>Course Not Found</h2>
                    <button className="btn btn-glass mt-2" onClick={handleBack}>
                        {t('back')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="course-container">
            {/* Top Navigation */}
            <div className="top-nav">
                {/* Back Button */}
                <button
                    className={`nav-btn back-btn ${backHover ? 'expanded' : ''}`}
                    onMouseEnter={() => setBackHover(true)}
                    onMouseLeave={() => setBackHover(false)}
                    onClick={handleBack}
                >
                    <span className="btn-icon">←</span>
                    <span className="btn-text">{t('back')}</span>
                </button>

                {/* Search Bar */}
                <div className="nav-search">
                    <SearchComponent
                        courseView={true}
                    />
                </div>

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
                        <span className="btn-text">{t('settings')}</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Collapsible Sections */}
                <div className="content-sections">
                    {/* Course Exams Section */}
                    <div className={`section-container ${showExams ? 'expanded' : 'collapsed'}`}>
                        <div
                            className="section-header"
                            onClick={() => setShowExams(!showExams)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h2>{t('courseExams')}</h2>
                            <div className="view-segmented-control" onClick={(e) => e.stopPropagation()}>
                                <div className="segment-slider" style={sliderStyle}></div>
                                <button
                                    ref={fullBtnRef}
                                    className={`segment-btn ${view === 'full' ? 'active' : ''}`}
                                    onClick={() => setView('full')}
                                    title={t('switchToFull')}
                                >
                                    📄 {t('full')}
                                </button>
                                <button
                                    ref={compactBtnRef}
                                    className={`segment-btn ${view === 'compact' ? 'active' : ''}`}
                                    onClick={() => setView('compact')}
                                    title={t('switchToCompact')}
                                >
                                    📋 {t('compact')}
                                </button>
                                <button
                                    ref={timedBtnRef}
                                    className={`segment-btn ${view === 'timed' ? 'active' : ''}`}
                                    onClick={() => setView('timed')}
                                    title={t('switchToTimed')}
                                >
                                    ⏱️ {t('timed')}
                                </button>
                            </div>
                            {!apiLoading && fetchType && (
                                <div
                                    className={`fetch-indicator ${fetchType}`}
                                    title={fetchType === 'from-cache' ? t('exams') + ' ' + t('dataFromCache') + (fetchTime ? ` (${formatTimestamp(fetchTime)})` : '') : t('exams') + ' ' + t('freshlyQueriedData') + (fetchTime ? ` (${formatTimestamp(fetchTime)})` : '')}
                                >
                                    <span className="fetch-tooltip">
                                        {fetchType === 'from-cache' ? t('exams') + ' ' + t('cached') : t('exams') + ' ' + t('fresh')}
                                        {fetchTime && <><br />{formatTimestamp(fetchTime)}</>}
                                    </span>
                                </div>
                            )}
                            {!apiLoading && (
                                <button
                                    className="refresh-exam-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRefreshExams();
                                    }}
                                    title={t('refreshText')}
                                >
                                    ↻
                                    <span className="refresh-tooltip">{t('refreshTextExam')}</span>
                                </button>
                            )}
                            <span className={`expand-icon ${showExams ? 'rotated' : ''}`}>▼</span>
                        </div>

                        {showExams && (
                            <div className="section-content">
                                {apiLoading ? (
                                    <div className="skeleton-loading">
                                        <p className="loading-text">{t('loadingExams')}</p>
                                        <div className="skeleton-row"></div>
                                        <div className="skeleton-row"></div>
                                        <div className="skeleton-row"></div>
                                        <div className="skeleton-row"></div>
                                        <div className="skeleton-row"></div>
                                        <div className="skeleton-row"></div>
                                        <div className="skeleton-row"></div>
                                        <div className="skeleton-row"></div>
                                    </div>
                                ) : (
                                    <CalendarView
                                        courseId={courseId}
                                        courseName={course.title}
                                        examConflicts={examConflicts}
                                        view={view}
                                        setView={setView}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Course Info Section */}
                    <div className={`section-container ${showInfo ? 'expanded' : 'collapsed'}`}>
                        <div
                            className="section-header"
                            onClick={() => setShowInfo(!showInfo)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h2>{t('courseInfo')}</h2>
                            <span className={`expand-icon ${showInfo ? 'rotated' : ''}`}>▼</span>
                        </div>

                        {showInfo && (
                            <div className="section-content">
                                <div className="course-info-content">
                                    <div className="info-group">
                                        <h3>{t('name')}:</h3>
                                        <p>{course.title}</p>
                                    </div>

                                    <div className="info-group">
                                        <h3>{t('courseCode')}:</h3>
                                        <p>{course.code}</p>
                                    </div>

                                    <div className="info-group">
                                        <h3>{t('activeStudents')}:</h3>
                                        <p>{course.students_active}</p>
                                    </div>


                                    <div className="info-group">
                                        <h3>{t('newStudents')}:</h3>
                                        <p>{course.students_new}</p>
                                    </div>


                                    {course.instances && course.instances.length > 0 && (
                                        <div className="info-group">
                                            <h3>{t('courseInstances')}:</h3>
                                            <div className="instances-list">
                                                {course.instances.map((instance) => (
                                                    <div key={instance.id} className="instance-item">
                                                        <div className="instance-header">
                                                            <span className="instance-code">📚 {instance.id} - {instance.course_number}</span>
                                                            <span className="instance-year">{instance.academic_year}</span>
                                                        </div>
                                                        <div className="instance-instructor">
                                                            👨‍🏫 {instance.instructor}
                                                        </div>
                                                        {instance.alpha_range && (
                                                            <div className="instance-alpha">
                                                                🔤 {instance.alpha_range}
                                                            </div>
                                                        )}
                                                        <div className="instance-details">
                                                            <span className="instance-stat">
                                                                👥 Active: {instance.num_active_students}
                                                            </span>
                                                            <span className="instance-stat">
                                                                ✨ New: {instance.num_new_students}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
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

export default Course;