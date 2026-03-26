import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkCredentialsApi } from '../utils/api_calls';

// Create the auth context
const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'auth_user';
const REMEMBER_ME_TTL_MS = 7 * 24 * 60 * 60 * 1000;  // 1 week in milliseconds

const saveAuthToStorage = (userData, rememberMe) => {
    const payload = JSON.stringify({
        ...userData,
        rememberMe,
        expiresAt: rememberMe ? Date.now() + REMEMBER_ME_TTL_MS : null
    });

    // Keep a single source of truth across storages.
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, payload);
        return;
    }

    sessionStorage.setItem(AUTH_STORAGE_KEY, payload);
};

const getAuthFromStorage = () => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    try {
        const parsed = JSON.parse(stored);

        // Enforce 1-week expiration for persisted "remember me" logins.
        if (parsed?.rememberMe) {
            const isExpired = !parsed.expiresAt || Date.now() > parsed.expiresAt;
            if (isExpired) {
                clearAuthStorage();
                return null;
            }
        }

        return parsed;
    } catch {
        clearAuthStorage();
        return null;
    }
};

const clearAuthStorage = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize from storage if available
    useEffect(() => {
        const savedUser = getAuthFromStorage();

        if (savedUser?.username && savedUser?.password) {
            // Restore from storage and verify
            verifyAndLogin(savedUser.username, savedUser.password, !!savedUser.rememberMe);
        }
    }, []);

    const verifyAndLogin = async (username, password, rememberMe = true) => {
        try {
            const credentials = btoa(`${username}:${password}`);
            const authHeader = `Basic ${credentials}`;

            const response = await checkCredentialsApi(authHeader);

            if (response.status === 'success') {
                const userData = {
                    username: response.username,
                    password,
                    permissions: response.permissions
                };

                setUser(userData);
                setIsAuthenticated(true);

                saveAuthToStorage(userData, rememberMe);

                return { success: true };
            }

            return { success: false, error: 'Invalid credentials' };
        } catch (error) {
            console.error('Login verification error:', error);
            return {
                success: false,
                error: error.response?.status === 401
                    ? 'Invalid credentials'
                    : 'Connection error'
            };
        }
    };

    const login = async (username, password, rememberMe = true) => {
        return await verifyAndLogin(username, password, rememberMe);
    };

    const logout = () => {
        // Clear user and authentication
        setUser(null);
        setIsAuthenticated(false);

        clearAuthStorage();
    };

    const getAuthHeader = () => {
        if (!user) return null;

        const credentials = btoa(`${user.username}:${user.password}`);
        return `Basic ${credentials}`;
    };

    const value = {
        user,
        isAuthenticated,
        login,
        logout,
        getAuthHeader
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
