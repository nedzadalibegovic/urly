import React, { createContext, useContext, useEffect, useState } from 'react';
import { TokenContext } from './TokenContext';

export const ShortiesContext = createContext();

const ShortiesContextProvider = (props) => {
    const { token, renewToken } = useContext(TokenContext);
    const [shorties, setShorties] = useState([]);

    const renewShorties = async () => {
        if (!token) return renewToken();

        const response = await fetch(process.env.REACT_APP_API, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) return renewToken();

        setShorties(await response.json());
    };

    const addShorty = async (shorty) => {
        const response = await fetch(process.env.REACT_APP_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(shorty),
        });
        const json = await response.json();

        if (response.ok) {
            setShorties([...shorties, json]);
        } else if (response.status === 403) {
            await renewToken();
            throw new Error('Access token expired, please retry action');
        } else {
            throw new Error(json.message);
        }
    };

    const editShorty = async (shorty) => {
        const response = await fetch(
            process.env.REACT_APP_API + `/${shorty._id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(shorty),
            }
        );
        const json = await response.json();

        if (response.ok) {
            const newShorties = shorties.slice();
            const index = newShorties.findIndex((x) => x._id === json._id);

            newShorties[index] = json;
            setShorties(newShorties);
        } else if (response.status === 403) {
            await renewToken();
            throw new Error('Access token expired, please retry action');
        } else {
            throw new Error(json.message);
        }
    };

    useEffect(() => {
        renewShorties();
    }, [token]);

    return (
        <ShortiesContext.Provider value={{ shorties, addShorty, editShorty }}>
            {props.children}
        </ShortiesContext.Provider>
    );
};

export default ShortiesContextProvider;
