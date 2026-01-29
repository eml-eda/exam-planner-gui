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
    switchToFull: { en: 'Switch to Full View', it: 'Passa alla Vista Completa' },
    switchToCompact: { en: 'Switch to Compact View', it: 'Passa alla Vista Compatta' },
    switchToTimed: { en: 'Switch to Timed View', it: 'Passa alla Vista Temporale' },
    compact: { en: 'Compact', it: 'Compatta' },
    full: { en: 'Full', it: 'Completa' },
    timed: { en: 'Timed', it: 'Temporale' },
    settings: { en: 'Settings', it: 'Impostazioni' },
    courses: { en: 'Courses', it: 'Corsi' },
    exams: { en: 'Exams', it: 'Esami' },
    refreshTextCourse: { en: 'Refresh the courses cache.', it: 'Aggiorna la cache dei corsi.' },
    refreshTextExam: { en: 'Refresh the exams cache.', it: 'Aggiorna la cache degli esami.' },

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
    dataFromCache: { en: 'Data from cache', it: 'Dati dalla cache' },
    freshlyQueriedData: { en: 'Freshly queried data', it: 'Dati appena interrogati' },
    cached: { en: 'Cached 📦', it: 'Dalla Cache 📦' },
    fresh: { en: 'Fresh 🔄', it: 'Appena Interrogati 🔄' },
    loadingExams: { en: 'Loading Exams Data...', it: 'Caricamento Dati Esami...' },
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
    start: { en: 'Start', it: 'Inizio' },
    end: { en: 'End', it: 'Fine' },

    // Settings modal
    examDateRange: { en: 'Exam Date Range', it: 'Periodo Esami' },
    startDate: { en: 'Start Date', it: 'Data Inizio' },
    endDate: { en: 'End Date', it: 'Data Fine' },
    save: { en: 'Save', it: 'Salva' },
    cancel: { en: 'Cancel', it: 'Annulla' },
    syncDatabase: { en: 'Sync Database', it: 'Sincronizza Database' },
    syncDatabaseTitle: { en: 'Database Synchronization', it: 'Sincronizzazione Database' },
    checkAll: { en: 'Check All', it: 'Seleziona Tutto' },
    uncheckAll: { en: 'Uncheck All', it: 'Deseleziona Tutto' },
    sync: { en: 'Sync', it: 'Sincronizza' },
    syncing: { en: 'Syncing...', it: 'Sincronizzazione...' },
    syncSuccess: { en: 'Database synchronized successfully', it: 'Database sincronizzato con successo' },
    syncWarning: { en: 'Select the keys to synchronize from the backend server.', it: 'Seleziona i chiavi da sincronizzare dal server backend.' },

    // Exam details
    examTime: { en: 'Exam Time', it: 'Orario Esame' },
    registeredStudents: { en: 'Registered Students', it: 'Studenti Iscritti' },
    applicationDeadline: { en: 'Application Deadline', it: 'Scadenza Iscrizione' },

    // Languages
    english: { en: 'ENG', it: 'ENG' },
    italian: { en: 'IT', it: 'IT' },

    // Error messages
    error: { en: 'Error', it: 'Errore' },
    backend_error_message: {
        en: 'Unable to load data. Please check your server availability and refresh the page.',
        it: 'Impossibile caricare i dati. Si prega di verificare la disponibilità del server e aggiornare la pagina.'
    },
    backend_error_config_message: {
        en: 'Configuration mismatch detected. Please check your server configuration and refresh the page.',
        it: 'Rilevata una discrepanza di configurazione. Si prega di verificare la configurazione del server e aggiornare la pagina.'
    }
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