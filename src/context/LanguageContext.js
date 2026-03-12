import React, { createContext, useContext, useState } from 'react';

// Create the language context
const LanguageContext = createContext();

// Translation object
const translations = {
    //Home
    recently_searched: { en: 'Recent Searches: ', it: 'Ricerche Recenti: ' },

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
    exam_data: { en: 'Exam Data for', it: 'Dati Esami per' },
    exam_sched: { en: 'Exam Schedular', it: 'Calendario Esami' },

    // Search
    wait_courses: { en: 'Please wait, loading courses...', it: 'Attendere, caricamento corsi...' },
    search: { en: 'Search for Professor, Course, or (e.g. Pagliari, 04KWQXQ)', it: 'Cerca Professore, Corso, o (es. Pagliari, 04KWQXQ)' },
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
    instance: { en: 'Instance', it: 'Istanza' },
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
    examSessionConfiguration: { en: 'Exam Session Configuration', it: 'Configurazione Sessione Esami' },
    year: { en: 'Year', it: 'Anno' },
    session: { en: 'Session', it: 'Sessione' },
    sessionName: { en: 'Session Name', it: 'Nome Sessione' },
    configWarning: { en: 'Saving will reload backend server. Ensure no other users are active.', it: 'Salvare ricaricherà il server backend. Assicurarsi che nessun altro utente sia attivo.' },
    reloadingBackend: { en: 'Now Reloading the back-end....', it: 'Ora ricaricando il back-end....' },
    syncDatabase: { en: 'Sync Database', it: 'Sincronizza Database' },
    syncDatabaseTitle: { en: 'Database Synchronization', it: 'Sincronizzazione Database' },
    checkAll: { en: 'Check All', it: 'Seleziona Tutto' },
    uncheckAll: { en: 'Uncheck All', it: 'Deseleziona Tutto' },
    sync: { en: 'Sync', it: 'Sincronizza' },
    syncing: { en: 'Syncing...', it: 'Sincronizzazione...' },
    syncSuccess: { en: 'Database synchronized successfully', it: 'Database sincronizzato con successo' },
    syncWarning: { en: 'Select the keys to synchronize from the backend server.', it: 'Seleziona i chiavi da sincronizzare dal server backend.' },
    offeringsOutdatedWarning: {
        en: 'The previous synchronization of the offerta.csv files was more than a month ago. Are you sure you want to sync the exams without the offerings?',
        it: 'La precedente sincronizzazione dei file offerta.csv è stata più di un mese fa. Sei sicuro di voler sincronizzare gli esami senza le offerte?'
    },
    syncWithoutOfferings: { en: 'Sync without offerings', it: 'Sincronizza senza offerte' },
    syncWithOfferings: { en: 'Sync with offerings', it: 'Sincronizza con offerte' },

    // Export modal
    exportExams: { en: 'Export Exams', it: 'Esporta Esami' },
    selectCollegi: { en: 'Select Collegi', it: 'Seleziona Collegi' },
    export: { en: 'Export', it: 'Esporta' },
    exporting: { en: 'Exporting...', it: 'Esportazione...' },
    noCollegiSelected: { en: 'Please select at least one collegio', it: 'Seleziona almeno un collegio' },
    exportFailed: { en: 'Export failed', it: 'Esportazione fallita' },
    exportError: { en: 'Error exporting exams', it: 'Errore nell\'esportazione degli esami' },

    // Login modal
    login: { en: 'Login', it: 'Accedi' },
    loginButton: { en: 'Login', it: 'Accedi' },
    loggingIn: { en: 'Logging in...', it: 'Accesso in corso...' },
    logout: { en: 'Logout', it: 'Esci' },
    currentUser: { en: 'Current User', it: 'Utente Corrente' },
    username: { en: 'Username', it: 'Nome Utente' },
    password: { en: 'Password', it: 'Password' },
    enterUsername: { en: 'Enter username', it: 'Inserisci nome utente' },
    enterPassword: { en: 'Enter password', it: 'Inserisci password' },
    rememberMe: { en: 'Remember me', it: 'Ricordami' },
    showPassword: { en: 'Show password', it: 'Mostra password' },
    hidePassword: { en: 'Hide password', it: 'Nascondi password' },
    credentialsRequired: { en: 'Username and password are required', it: 'Nome utente e password sono obbligatori' },
    invalidCredentials: { en: 'Invalid username or password', it: 'Nome utente o password non validi' },
    loginError: { en: 'Login error occurred', it: 'Si è verificato un errore di accesso' },
    availableAccounts: { en: 'Available Accounts', it: 'Account Disponibili' },
    fullAccess: { en: 'Full access (read, write, export, sync)', it: 'Accesso completo (lettura, scrittura, esportazione, sincronizzazione)' },
    editAccess: { en: 'Read, write, and export', it: 'Lettura, scrittura ed esportazione' },
    readOnlyAccess: { en: 'Read-only access', it: 'Accesso solo lettura' },
    default: { en: 'default', it: 'predefinito' },

    // Exam details
    examTime: { en: 'Exam Time', it: 'Orario Esame' },
    registeredStudents: { en: 'Registered Students', it: 'Studenti Iscritti' },
    applicationDeadline: { en: 'Application Deadline', it: 'Scadenza Iscrizione' },

    // Languages
    english: { en: 'ENG', it: 'ENG' },
    italian: { en: 'IT', it: 'IT' },

    // Error messages
    error: { en: 'Error', it: 'Errore' },
    close: { en: 'Close', it: 'Chiudi' },
    goToHome: { en: 'Go to Home', it: 'Vai alla Home' },
    authenticationRequired: { en: 'Authentication required. Please login with valid credentials.', it: 'Autenticazione richiesta. Effettua il login con credenziali valide.' },
    permissionDenied: { en: 'Permission denied. You do not have the required permissions for this action.', it: 'Permesso negato. Non hai i permessi necessari per questa azione.' },
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