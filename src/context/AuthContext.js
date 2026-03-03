import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkCredentialsApi } from '../utils/api_calls';

// Create the auth context
const AuthContext = createContext();

// Helper functions for cookie management
const setCookie = (name, value, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize with default viewer credentials or from cookie
    useEffect(() => {
        const savedUsername = getCookie('auth_username');
        const savedPassword = getCookie('auth_password');

        if (savedUsername && savedPassword) {
            // Restore from cookie and verify
            verifyAndLogin(savedUsername, savedPassword, false);
        } else {
            // Set default viewer credentials
            setUser({
                username: 'viewer',
                password: 'view123',
                permissions: ['read']
            });
            setIsAuthenticated(true);
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

                // Save to cookie if remember me is checked
                if (rememberMe) {
                    setCookie('auth_username', username, 7);
                    setCookie('auth_password', password, 7);
                }

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
        // Reset to default viewer
        setUser({
            username: 'viewer',
            password: 'view123',
            permissions: ['read']
        });
        setIsAuthenticated(true);

        // Clear cookies
        deleteCookie('auth_username');
        deleteCookie('auth_password');
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
