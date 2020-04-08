import React, { createContext, useContext, useEffect, useState } from 'react';
import { TokenContext } from './TokenContext';

export const UrliesContext = createContext();

const UrliesContextProvider = (props) => {
    const { token, renewToken } = useContext(TokenContext);
    const [urlies, setUrlies] = useState([]);

    const renewUrlies = async () => {
        if (!token) return renewToken();

        const response = await fetch(process.env.REACT_APP_API, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) return renewToken();

        setUrlies(await response.json());
    };

    const addUrly = async (urly) => {
        const response = await fetch(process.env.REACT_APP_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(urly),
        });
        const json = await response.json();

        if (response.ok) {
            setUrlies([...urlies, json]);
        } else if (response.status === 403) {
            await renewToken();
            throw new Error('Access token expired, please retry action');
        } else {
            throw new Error(json.message);
        }
    };

    const editUrly = async (urly) => {
        const response = await fetch(
            process.env.REACT_APP_API + `/${urly._id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(urly),
            }
        );
        const json = await response.json();

        if (response.ok) {
            const newUrlies = urlies.slice();
            const index = newUrlies.findIndex((x) => x._id === json._id);

            newUrlies[index] = json;
            setUrlies(newUrlies);
        } else if (response.status === 403) {
            await renewToken();
            throw new Error('Access token expired, please retry action');
        } else {
            throw new Error(json.message);
        }
    };

    useEffect(() => {
        renewUrlies();
    }, [token]);

    return (
        <UrliesContext.Provider value={{ urlies, addUrly, editUrly }}>
            {props.children}
        </UrliesContext.Provider>
    );
};

export default UrliesContextProvider;
