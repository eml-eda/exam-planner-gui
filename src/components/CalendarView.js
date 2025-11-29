import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getExamsInDateRange, getCourseIdFromExam } from '../utils/database';
import './CalendarView.css';

const CalendarView = ({ courseId, courseName, exams = [] }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [allExams, setAllExams] = useState([]);
    const [dateRange, setDateRange] = useState({ start: '2026-01-01', end: '2026-02-28' });
    const [hoveredExam, setHoveredExam] = useState(null);

    useEffect(() => {
        // Load date range from localStorage if available
        const savedRange = localStorage.getItem('examDateRange');
        if (savedRange) {
            try {
                const parsed = JSON.parse(savedRange);
                setDateRange({ start: parsed.startDate, end: parsed.endDate });
            } catch (error) {
                console.error('Error parsing saved date range:', error);
            }
        }
    }, []);

    useEffect(() => {
        const loadAllExams = async () => {
            try {
                const allExamData = await getExamsInDateRange(dateRange.start, dateRange.end);
                setAllExams(allExamData);
            } catch (error) {
                console.error('Error loading exam data:', error);
            }
        };

        loadAllExams();
    }, [dateRange]);

    // Generate calendar weeks
    const generateCalendarWeeks = () => {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        const weeks = [];

        // We should start from the Monday of the week of startDate
        const current = new Date(startDate);
        const dayOfWeek = current.getDay();
        const daysToMonday = dayOfWeek === 0 ? -6 : -(dayOfWeek - 1);
        current.setDate(current.getDate() + daysToMonday);

        while (current <= endDate) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                week.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
            weeks.push(week);
        }

        return weeks;
    };

    const weeks = generateCalendarWeeks();

    // Get exams for a specific date
    const getExamsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return allExams.filter(exam => exam.date === dateStr);
    };

    // Determine exam color based on relationship to current course
    const getExamColor = (exam) => {
        if (exam.course_name === courseName) {
            return 'current-course'; // Green
        }

        // Check for conflicts (±1 day)
        const examDate = new Date(exam.date);
        const courseExamDates = exams.map(e => new Date(e.date));

        for (const courseDate of courseExamDates) {
            const dayDiff = Math.abs((examDate - courseDate) / (1000 * 60 * 60 * 24));
            if (dayDiff === 1) {
                return 'conflict-minor'; // Yellow
            }
            if (dayDiff === 2) {
                return 'conflict-major'; // Red
            }
        }

        return 'neutral'; // White/neutral
    };

    const handleExamClick = (exam) => {
        if (exam.course_name !== courseName) {
            // Get the course ID by traversing semester_exam_name_id -> exam_name -> course_name
            const courseId = getCourseIdFromExam(exam);
            if (courseId) {
                navigate(`/course/${courseId}`);
            } else {
                console.error('Could not find course ID for exam:', exam);
            }
        }
    };

    const formatDay = (dayIndex) => {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        return t(days[dayIndex]);
    };

    // Group weeks by month
    const monthGroups = [];
    let currentMonth = null;
    let currentWeeks = [];

    weeks.forEach(week => {
        const monthKey = week[3].toLocaleDateString('en', { month: 'long', year: 'numeric' });
        if (currentMonth !== monthKey) {
            if (currentWeeks.length > 0) {
                monthGroups.push({ month: currentMonth, weeks: currentWeeks });
            }
            currentMonth = monthKey;
            currentWeeks = [];
        }
        currentWeeks.push(week);
    });

    if (currentWeeks.length > 0) {
        monthGroups.push({ month: currentMonth, weeks: currentWeeks });
    }

    return (
        <div className="calendar-view">
            {monthGroups.map(({ month, weeks }, monthIndex) => (
                <div key={monthIndex} className="month-section">
                    <h3 className="month-header">{month}</h3>

                    {/* Day headers */}
                    <div className="calendar-header">
                        {Array.from({ length: 7 }, (_, i) => (
                            <div key={i} className="day-header">
                                {formatDay(i)}
                            </div>
                        ))}
                    </div>

                    {/* Calendar weeks */}
                    <div className="calendar-grid">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="calendar-week">
                                {week.map((date, dayIndex) => {
                                    const dayExams = getExamsForDate(date);
                                    const isInRange = date >= new Date(dateRange.start) && date <= new Date(dateRange.end);

                                    return (
                                        <div
                                            key={dayIndex}
                                            className={`calendar-day ${!isInRange ? 'out-of-range' : ''}`}
                                        >
                                            <div className="day-number">
                                                {date.getDate()}
                                            </div>

                                            {dayExams.length > 0 && isInRange && (
                                                <div className="day-exams">
                                                    {dayExams.map((exam, examIndex) => (
                                                        <div
                                                            key={examIndex}
                                                            className={`exam-item ${getExamColor(exam)}`}
                                                            onClick={() => handleExamClick(exam)}
                                                            onMouseEnter={() => setHoveredExam(exam)}
                                                            onMouseLeave={() => setHoveredExam(null)}
                                                        >
                                                            <span className="exam-code">
                                                                {exam.course_code}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Exam tooltip */}
            {hoveredExam && (
                <div className="exam-tooltip">
                    <div className="tooltip-header">
                        <strong>{hoveredExam.course_name}</strong>
                    </div>
                    <div className="tooltip-details">
                        <div>Code: {hoveredExam.course_code}</div>
                        <div>Professor: {hoveredExam.professor_name}</div>
                        <div>Time: {hoveredExam.start_time} - {hoveredExam.end_time}</div>
                        <div>Students: {hoveredExam.registered_students_num}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;