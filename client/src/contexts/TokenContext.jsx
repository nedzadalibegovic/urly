import React, { createContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const TokenContext = createContext();

const TokenContextProvider = (props) => {
    const [token, setToken] = useState('');
    const history = useHistory();

    const renewToken = async () => {
        const response = await fetch(process.env.REACT_APP_TOKEN, {
            credentials: 'include',
        });
        const { accessToken } = await response.json();

        if (!response.ok) return history.push('/login');

        setTokenLS(accessToken);
    };

    const getTokenLS = () => {
        const accessToken = localStorage.getItem('accessToken');
        accessToken ? setToken(accessToken) : renewToken();
    };

    const setTokenLS = (newToken) => {
        setToken(newToken);
        localStorage.setItem('accessToken', newToken);
    };

    const deleteTokenLS = () => {
        setToken(null);
        localStorage.removeItem('accessToken');
    };

    return (
        <TokenContext.Provider
            value={{
                token,
                loadToken: getTokenLS,
                setToken: setTokenLS,
                deleteToken: deleteTokenLS,
                renewToken,
            }}
        >
            {props.children}
        </TokenContext.Provider>
    );
};

export default TokenContextProvider;
