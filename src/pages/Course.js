import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getCourseById, getExamsByCourse } from '../utils/database';
import SearchComponent from '../components/SearchComponent';
import SettingsModal from '../components/SettingsModal';
import CalendarView from '../components/CalendarView';
import './Course.css';

const Course = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { isEnglish, toggleLanguage, t } = useLanguage();
    const [course, setCourse] = useState(null);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [settingsHover, setSettingsHover] = useState(false);
    const [backHover, setBackHover] = useState(false);
    const [showExams, setShowExams] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        const loadCourseData = async () => {
            try {
                setLoading(true);
                const courseData = await getCourseById(courseId);
                if (courseData) {
                    setCourse(courseData);
                    const examData = await getExamsByCourse(courseData.course_name);
                    setExams(examData);
                }
            } catch (error) {
                console.error('Error loading course data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCourseData();
    }, [courseId]);

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

    const degreePrograms = course.degree_programs ? course.degree_programs.split(';') : [];

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
                                <CalendarView
                                    courseId={courseId}
                                    courseName={course.course_name}
                                    exams={exams}
                                />
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
                                        <p>{course.course_name}</p>
                                    </div>

                                    <div className="info-group">
                                        <h3>{t('professor')}:</h3>
                                        <p>{course.professor_name}</p>
                                    </div>

                                    {course.credits && (
                                        <div className="info-group">
                                            <h3>{t('credits')}:</h3>
                                            <p>{course.credits}</p>
                                        </div>
                                    )}

                                    {degreePrograms.length > 0 && (
                                        <div className="info-group">
                                            <h3>{t('degreePrograms')}:</h3>
                                            <ul>
                                                {degreePrograms.map((program, index) => (
                                                    <li key={index}>{program.trim()}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {exams.length > 0 && (
                                        <div className="info-group">
                                            <h3>{t('studentNumber')}:</h3>
                                            <p>{exams[0]?.registered_students_num || 'N/A'}</p>
                                        </div>
                                    )}

                                    {course.description && (
                                        <div className="info-group">
                                            <h3>{t('description')}:</h3>
                                            <p>{course.description}</p>
                                        </div>
                                    )}

                                    {exams.length > 0 && (
                                        <div className="info-group">
                                            <h3>{t('instances')}:</h3>
                                            <div className="exam-instances">
                                                {exams.map((exam) => (
                                                    <div key={exam.id} className="exam-instance">
                                                        <span className="exam-date">{exam.date}</span>
                                                        <span className="exam-time">{exam.start_time} - {exam.end_time}</span>
                                                        <span className="exam-students">{exam.registered_students_num} students</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="action-buttons">
                                        <button className="btn btn-glass">
                                            {t('studentsList')}
                                        </button>
                                        <button className="btn btn-glass">
                                            {t('conflicts')}
                                        </button>
                                    </div>
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