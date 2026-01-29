import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './CalendarView.css';

const CalendarView = ({ courseId, examConflicts = [], view }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState({ start: '2026-01-12', end: '2026-02-21' });
    const [hoveredExam, setHoveredExam] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = React.useRef(null);

    const handleExamClick = (exam) => {
        if (exam.course_code !== courseId) {
            navigate(`/course/${exam.course_code}`);
        }
    };

    useEffect(() => {
        // Calculate date range from examConflicts data
        if (examConflicts.length > 0) {
            const dates = examConflicts.map(ec => ec.date).sort();
            const startDate = dates[0];
            const endDate = dates[dates.length - 1];
            setDateRange({ start: startDate, end: endDate });
        }
    }, [examConflicts]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        const container = containerRef.current;
        if (hoveredExam && container) {
            container.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [hoveredExam]);

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
        const dateExams = examConflicts.find(ec => ec.date === dateStr);
        return dateExams ? dateExams.exams : [];
    };

    // Determine exam color based on conflict info
    const getExamColor = (exam) => {
        if (exam.course_code === courseId) {
            return 'current-course'; // Green - this is the course being viewed
        }

        const conflict = exam.conflict_info;
        if (!conflict) return 'neutral';

        // High priority conflicts
        if (conflict.all > 0 && conflict.same_semester) {
            return 'conflict-major'; // Red - same year and semester with conflicts
        }

        // Medium priority conflicts
        if (conflict.all > 0 && conflict.same_year) {
            return 'conflict-minor'; // Yellow - has conflicts
        }

        return 'neutral'; // White/neutral - no conflicts
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
        <div className="calendar-container" ref={containerRef}>
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
                                                <div className={`day-number-container ${view === 'timed' ? 'timed' : ''}`}>
                                                    <span className={`day-number-start ${view === 'timed' ? 'timed' : ''}`}>
                                                        {t('start')}
                                                    </span>
                                                    <div className="day-number">
                                                        {date.getDate()}
                                                    </div>
                                                    <span className={`day-number-end ${view === 'timed' ? 'timed' : ''}`}>
                                                        {t('end')}
                                                    </span>
                                                </div>

                                                {dayExams.length > 0 && isInRange && (
                                                    <div className="day-exams">
                                                        {dayExams.slice().sort((a, b) => {
                                                            if (!a.start_time) return 1;
                                                            if (!b.start_time) return -1;
                                                            return a.start_time.localeCompare(b.start_time);
                                                        }).sort((a, b) => {
                                                            if (!a.end_time) return 1;
                                                            if (!b.end_time) return -1;
                                                            return a.end_time.localeCompare(b.end_time);
                                                        })
                                                            .map((exam, examIndex) => (
                                                                <div key={examIndex} className="exam-entry">
                                                                    <div className={`exam-start ${view === 'timed' ? 'timed' : ''}`}>
                                                                        <p className='exam-time'>{exam.start_time}</p>
                                                                    </div>
                                                                    <div
                                                                        className={`exam-item ${getExamColor(exam)} ${view === 'compact' ? 'compact' : ''} ${view === 'timed' ? 'timed' : ''}`}
                                                                        onClick={() => handleExamClick(exam)}
                                                                        onMouseEnter={() => setHoveredExam(exam)}
                                                                        onMouseLeave={() => setHoveredExam(null)}
                                                                        style={{ cursor: exam.course_code !== courseId ? 'pointer' : 'default' }}
                                                                    >
                                                                        <p className={`exam-code ${view !== 'full' ? 'compact' : ''}`}>
                                                                            {exam.course_code}
                                                                        </p>
                                                                        {exam.conflict_info && exam.conflict_info.all > 0 && (
                                                                            <p className={`exam-conflicts exam-code ${view !== 'full' ? 'compact' : ''}`}>
                                                                                ({exam.conflict_info.all} - {exam.conflict_info.new})
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <div className={`exam-end ${view === 'timed' ? 'timed' : ''}`}>
                                                                        <p className='exam-time'>{exam.end_time}</p>
                                                                    </div>
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
            </div>

            {/* Exam tooltip */}
            {hoveredExam && (
                <div
                    className="exam-tooltip"
                    style={{
                        left: `${mousePosition.x + 15}px`,
                        top: `${mousePosition.y + 15}px`
                    }}
                >
                    <div className="tooltip-header">
                        <strong>{hoveredExam.course_title}</strong>
                    </div>
                    <div className="tooltip-details">
                        <div>Type: {hoveredExam.exam_type}</div>
                        {hoveredExam.start_time && hoveredExam.end_time && (
                            <div>Time: {hoveredExam.start_time} - {hoveredExam.end_time}</div>
                        )}
                        {hoveredExam.conflict_info && hoveredExam.course_code !== courseId && (
                            <>
                                <div>Total Conflicts: {hoveredExam.conflict_info.all}</div>
                                <div>New Students Conflicts: {hoveredExam.conflict_info.new}</div>
                                {hoveredExam.conflict_info.same_semester && (
                                    <div className="warning">⚠️ Same Semester</div>
                                )}
                                {hoveredExam.conflict_info.same_year && (
                                    <div className="warning">⚠️ Same Year</div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;