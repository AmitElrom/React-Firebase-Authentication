import { createContext, useEffect, useState, useCallback } from 'react';

let logoutTimer;

const authContext = createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { },
});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const futureExpirationTime = new Date(expirationTime).getTime();

    const remainingTime = futureExpirationTime - currentTime;
    return remainingTime;
}

const retrieveStoredToken = () => {
    const storedToken = sessionStorage.getItem('token');
    const storedRemainingTime = sessionStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedRemainingTime);

    if (remainingTime <= 60000) {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('expirationTime')
        return null;
    }
    return {
        storedToken,
        storedRemainingTime
    }
}

export const AuthContextProvider = ({ children }) => {
    const storedData = retrieveStoredToken();
    let initialToken;
    if (storedData) {
        initialToken = storedData.storedToken;
    }
    const [token, setToken] = useState(initialToken);

    let isLoggedIn = !!token;


    const logout = useCallback(() => {
        setToken(null)
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('expirationTime')

        if (logoutTimer) {
            clearTimeout(logoutTimer)
        }
    }, [])

    useEffect(() => {
        if (storedData) {
            const remainingTime = calculateRemainingTime(storedData.storedRemainingTime);
            logoutTimer = setTimeout(logout, remainingTime)
        }
    }, [storedData, logout])

    const login = (token, expirationTime) => {
        setToken(token)
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('expirationTime', expirationTime)

        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logout, remainingTime)
    }


    const authContextValue = {
        token,
        isLoggedIn,
        login,
        logout,
    }

    return (<authContext.Provider value={authContextValue} >
        {children}
    </authContext.Provider>)
};

export default authContext;

