import React, { createContext, useContext, useState } from 'react';

// Create the language context
const LanguageContext = createContext();

// Translation object
const translations = {
    // Navigation
    loading_courses: { en: 'Loading Database..', it: 'Caricamento Database...' },
    home: { en: 'Home', it: 'Home' },
    back: { en: 'Back', it: 'Indietro' },
    config: { en: 'Config', it: 'Configurazione' },
    settings: { en: 'Settings', it: 'Impostazioni' },

    // Search
    wait_courses: { en: 'Please wait, loading courses...', it: 'Attendere, caricamento corsi...' },
    search: { en: 'Search for Docente, Course, ....', it: 'Cerca Docente, Corso, ....' },
    foundCourses: { en: 'Found Courses:', it: 'Corsi Trovati:' },

    // Course info
    courseInfo: { en: 'Course Info', it: 'Info Corso' },
    courseCode: { en: 'Course Code', it: 'Codice Corso' },
    activeStudents: { en: 'Active Students', it: 'Studenti Attivi' },
    newStudents: { en: 'New Students', it: 'Studenti Nuovi' },
    instructors: { en: 'Instructors', it: 'Docenti' },
    courseInstances: { en: 'Course Instances', it: 'Istanze del Corso' },
    courseExams: { en: 'Course Exams', it: 'Esami del Corso' },
    name: { en: 'Name', it: 'Nome' },
    professor: { en: 'Professor', it: 'Professore' },
    credits: { en: 'Credits', it: 'Crediti' },
    description: { en: 'Description', it: 'Descrizione' },
    degreePrograms: { en: 'for Degrees Provided', it: 'per Lauree Fornite' },
    studentNumber: { en: 'Student Number', it: 'Numero Studenti' },
    instances: { en: 'Instances', it: 'Istanze' },

    // Calendar
    monday: { en: 'Monday', it: 'Lunedì' },
    tuesday: { en: 'Tuesday', it: 'Martedì' },
    wednesday: { en: 'Wednesday', it: 'Mercoledì' },
    thursday: { en: 'Thursday', it: 'Giovedì' },
    friday: { en: 'Friday', it: 'Venerdì' },
    saturday: { en: 'Saturday', it: 'Sabato' },
    sunday: { en: 'Sunday', it: 'Domenica' },

    january: { en: 'January', it: 'Gennaio' },
    february: { en: 'February', it: 'Febbraio' },
    march: { en: 'March', it: 'Marzo' },
    april: { en: 'April', it: 'Aprile' },
    may: { en: 'May', it: 'Maggio' },
    june: { en: 'June', it: 'Giugno' },
    july: { en: 'July', it: 'Luglio' },
    august: { en: 'August', it: 'Agosto' },
    september: { en: 'September', it: 'Settembre' },
    october: { en: 'October', it: 'Ottobre' },
    november: { en: 'November', it: 'Novembre' },
    december: { en: 'December', it: 'Dicembre' },

    // Buttons
    studentsList: { en: 'Students List', it: 'Lista Studenti' },
    conflicts: { en: 'Conflicts', it: 'Conflitti' },

    // Settings modal
    examDateRange: { en: 'Exam Date Range', it: 'Periodo Esami' },
    startDate: { en: 'Start Date', it: 'Data Inizio' },
    endDate: { en: 'End Date', it: 'Data Fine' },
    save: { en: 'Save', it: 'Salva' },
    cancel: { en: 'Cancel', it: 'Annulla' },

    // Exam details
    examTime: { en: 'Exam Time', it: 'Orario Esame' },
    registeredStudents: { en: 'Registered Students', it: 'Studenti Iscritti' },
    applicationDeadline: { en: 'Application Deadline', it: 'Scadenza Iscrizione' },

    // Languages
    english: { en: 'ENG', it: 'ENG' },
    italian: { en: 'IT', it: 'IT' }
};

// Language provider component
export const LanguageProvider = ({ children }) => {
    const [isEnglish, setIsEnglish] = useState(true);

    const toggleLanguage = () => {
        setIsEnglish(!isEnglish);
    };

    const t = (key) => {
        return translations[key] ? translations[key][isEnglish ? 'en' : 'it'] : key;
    };

    const value = {
        isEnglish,
        toggleLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook to use the language context
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;