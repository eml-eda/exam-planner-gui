import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { searchCourses } from '../utils/simpleDatabase';
import './SearchComponent.css';

const SearchComponent = () => {
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
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            if (query.trim()) {
                performSearch(query.trim());
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [query]);

    const performSearch = async (searchQuery) => {
        if (!searchQuery) {
            setResults([]);
            setShowResults(false);
            return;
        }

        setIsLoading(true);
        try {
            const searchResults = await searchCourses(searchQuery);
            setResults(searchResults);
            setShowResults(searchResults.length > 0);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
            setShowResults(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
    };

    const handleInputFocus = () => {
        if (results.length > 0) {
            setShowResults(true);
        }
    };

    const handleCourseClick = (course) => {
        setQuery('');
        setShowResults(false);
        navigate(`/course/${course.id}`);
    };

    const highlightMatch = (text, query) => {
        if (!query || !text) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ?
                <span key={index} className="highlight">{part}</span> :
                part
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
                    placeholder={t('search')}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
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
                                key={course.id}
                                className={`result-item ${index % 2 === 0 ? 'even' : 'odd'}`}
                                onClick={() => handleCourseClick(course)}
                            >
                                <div className="result-main">
                                    <div className="course-info">
                                        <h4 className="course-name">
                                            {highlightMatch(course.course_name, query)}
                                        </h4>
                                        <div className="course-details">
                                            <span className="course-code">
                                                {highlightMatch(course.course_code, query)}
                                            </span>
                                            <span className="separator">•</span>
                                            <span className="professor-name">
                                                {highlightMatch(course.professor_name, query)}
                                            </span>
                                            {course.credits && (
                                                <>
                                                    <span className="separator">•</span>
                                                    <span className="credits">{course.credits} {t('credits')}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="result-arrow">→</div>
                                </div>

                                {course.description && (
                                    <div className="course-description">
                                        {course.description.length > 100
                                            ? `${course.description.substring(0, 100)}...`
                                            : course.description
                                        }
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchComponent;