import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getCourseById } from '../utils/database';
import SearchComponent from '../components/SearchComponent';
import SettingsModal from '../components/SettingsModal';
import CalendarView from '../components/CalendarView';
import './Course.css';
import { getExamsApi } from '../utils/api_calls';

const Course = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { isEnglish, toggleLanguage, t } = useLanguage();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [settingsHover, setSettingsHover] = useState(false);
    const [backHover, setBackHover] = useState(false);
    const [showExams, setShowExams] = useState(true);
    const [showInfo, setShowInfo] = useState(true);
    const [apiLoading, setApiLoading] = useState(true);
    const [examConflicts, setExamConflicts] = useState([]);

    useEffect(() => {
        getExams();
        loadCourseData();
    }, [courseId]);

    const loadCourseData = async () => {
        try {
            setLoading(true);
            const courseData = await getCourseById(courseId);
            if (courseData) {
                setCourse(courseData);
            }
        } catch (error) {
            console.error('Error loading course data:', error);
        } finally {
            setLoading(false);
        }
    };

    async function getExams() {
        try {
            setApiLoading(true);
            console.log(`Fetching exam conflicts for course code ${courseId}`);
            const data = await getExamsApi(courseId);
            console.table(data);
            setExamConflicts(data);
        } catch (error) {
            console.error('Error fetching exam conflicts:', error);
        } finally {
            setApiLoading(false);
        }
    }


    const handleBack = () => {
        navigate(-1);
    };

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
                    <SearchComponent />
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
                        <span className="btn-text">{t('config')}</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Collapsible Sections */}
                <div className="content-sections">
                    {/* Course Exams Section */}
                    <div className={`section-container ${showExams ? 'expanded' : 'collapsed'}`}>
                        <button
                            className="section-header"
                            onClick={() => setShowExams(!showExams)}
                        >
                            <h2>{t('courseExams')}</h2>
                            <span className={`expand-icon ${showExams ? 'rotated' : ''}`}>▼</span>
                        </button>

                        {showExams && (
                            <div className="section-content">
                                {apiLoading ? (
                                    <div className="skeleton-loading">
                                        <p className="loading-text">Loading Exams Data...</p>
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
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Course Info Section */}
                    <div className={`section-container ${showInfo ? 'expanded' : 'collapsed'}`}>
                        <button
                            className="section-header"
                            onClick={() => setShowInfo(!showInfo)}
                        >
                            <h2>{t('courseInfo')}</h2>
                            <span className={`expand-icon ${showInfo ? 'rotated' : ''}`}>▼</span>
                        </button>

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
        </div>
    );
};

export default Course;