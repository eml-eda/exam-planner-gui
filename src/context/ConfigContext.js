import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getConfigApi } from '../utils/api_calls';
import { useNavigate } from 'react-router-dom';

// Create the config context
const ConfigContext = createContext();

// Config provider component
export const ConfigProvider = ({ children }) => {
    const navigate = useNavigate();
    const [config, setConfig] = useState({ year: 2026, name: 'winter', collegiList: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastConfigCheck, setLastConfigCheck] = useState(null);
    const [cachedConfigResult, setCachedConfigResult] = useState(false);

    // Fetch config from backend on mount
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setIsLoading(true);
                const data = await getConfigApi();
                setConfig({ year: data.year, name: data.name, collegiList: data.collegi });
                setError(null);
            } catch (err) {
                console.error('Error fetching config:', err);
                setError(err);
                // Keep default config on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const updateConfig = useCallback((newConfig) => {
        setConfig(newConfig);
    }, []);

    const checkConfigUneq = useCallback(async () => {
        const now = Date.now();
        const MAX_MINUTES = 5 * 60 * 1000; // X = 5 minutes in milliseconds

        // If less than X minutes since last check, return cached result
        if (lastConfigCheck && (now - lastConfigCheck) < MAX_MINUTES) {
            console.log('Using cached config check result');
            return cachedConfigResult;
        }

        // Make API call if X minutes have passed or first check
        console.log('Checking config from API');
        const data = await getConfigApi();
        const isUnequal = data.year !== config.year || data.name !== config.name;

        // Update cache
        setLastConfigCheck(now);
        setCachedConfigResult(isUnequal);

        return isUnequal;
    }, [config, lastConfigCheck, cachedConfigResult]);


    const forceRefreshPage = useCallback(() => {
        setTimeout(() => {
            navigate('/');
            window.location.reload();
        }, 1500);
    }, [navigate]);

    const value = {
        config,
        updateConfig,
        isLoading,
        error,
        checkConfigUneq,
        forceRefreshPage
    };

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};

// Custom hook to use the config context
export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};

export default ConfigContext;
