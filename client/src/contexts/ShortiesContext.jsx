import React, { createContext, useContext, useEffect, useState } from 'react';
import { TokenContext } from './TokenContext';

export const ShortiesContext = createContext();

const ShortiesContextProvider = props => {
    const { token, renewToken } = useContext(TokenContext);
    const [shorties, setShorties] = useState([]);

    const renewShorties = async () => {
        if (!token) return renewToken();

        const response = await fetch(process.env.REACT_APP_API, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) return renewToken();

        setShorties(await response.json());
    };

    useEffect(() => {
        renewShorties();
    }, [token]);

    return (
        <ShortiesContext.Provider value={{ shorties, setShorties }}>
            {props.children}
        </ShortiesContext.Provider>
    );
};

export default ShortiesContextProvider;
