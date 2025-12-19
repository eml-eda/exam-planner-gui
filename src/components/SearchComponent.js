import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { searchCourses } from '../utils/database';
import './SearchComponent.css';

const SearchComponent = ({ setlocked, isDisabled }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useLanguage();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
                setlocked?.(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setlocked]);

    const performSearch = useCallback(async (searchQuery) => {
        if (!searchQuery) {
            setResults([]);
            setShowResults(false);
            setlocked?.(false);
            return;
        }

        setIsLoading(true);
        try {
            const searchResults = await searchCourses(searchQuery);
            setResults(searchResults);
            setShowResults(searchResults.length > 0);
            setlocked?.(searchResults.length > 0);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
            setShowResults(false);
            setlocked?.(false);
        } finally {
            setIsLoading(false);
        }
    }, [setlocked]);

    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            if (query.trim()) {
                performSearch(query.trim());
            } else {
                setResults([]);
                setShowResults(false);
                setlocked?.(false);
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [query, performSearch, setlocked]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
    };

    const handleInputFocus = () => {
        if (results.length > 0) {
            setShowResults(true);
            setlocked?.(true);
        }
        // Select all text when focusing the input
        if (inputRef.current) {
            inputRef.current.select();
        }
    };

    const handleCourseClick = (course) => {
        setQuery('');
        setShowResults(false);
        setlocked?.(false);
        navigate(`/course/${course.code}`);
    };

    const highlightMatch = (text, query) => {
        if (!query || !text) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? <span key={index} className="highlight">{part}</span> : part
        );
    };

    return (
        <div ref={searchRef} className="search-component">
            {/* Search Input */}
            <div className="search-input-container">
                <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder={isDisabled ? t('wait_courses') : t('search')}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    disabled={isDisabled}
                />
                <div className="search-icon">
                    {isLoading ? (
                        <div className="loading-spinner"></div>
                    ) : (
                        <span>🔍</span>
                    )}
                </div>
            </div>

            {/* Search Results Panel */}
            {showResults && (
                <div className="search-results-panel">
                    <div className="results-header">
                        <h3>{t('foundCourses')}</h3>
                        <span className="results-count">({results.length})</span>
                    </div>

                    <div className="results-list">
                        {results.map((course, index) => (
                            <div
                                key={course.code}
                                className={`result-item ${index % 2 === 0 ? 'even' : 'odd'}`}
                                onClick={() => handleCourseClick(course)}
                            >
                                <div className="result-main">
                                    <div className="course-info">
                                        <h4 className="course-name">
                                            {highlightMatch(course.title, query)}
                                        </h4>
                                        <div className="course-details">
                                            <span className="course-code">
                                                {highlightMatch(course.code, query)}
                                            </span>
                                            {course.instructors && course.instructors.length > 0 && (
                                                <>
                                                    <span className="separator">•</span>
                                                    <span className="professor-name">
                                                        {course.instructors.map((instructor, i) => (
                                                            <span key={instructor.id}>
                                                                {highlightMatch(instructor.name, query)}
                                                                {i < course.instructors.length - 1 ? ', ' : ''}
                                                            </span>
                                                        ))}
                                                    </span>
                                                </>
                                            )}
                                            {course.students_active && (
                                                <>
                                                    <span className="separator">•</span>
                                                    <span className="students">{course.students_active} {t('students')}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="result-arrow">→</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchComponent;