import React, { useState, createContext } from 'react';
import { useHistory } from 'react-router-dom';

export const TokenContext = createContext();

const TokenContextProvider = (props) => {
    const [token, setToken] = useState('');
    const history = useHistory();

    const renewToken = async () => {
        const response = await fetch(process.env.REACT_APP_TOKEN, { credentials: 'include' });
        const { accessToken } = await response.json();

        if (!response.ok) return history.push('/login');

        setToken(accessToken);
    };

    return (
        <TokenContext.Provider value={{ token, setToken, renewToken }}>
            {props.children}
        </TokenContext.Provider>
    );
};

export default TokenContextProvider;