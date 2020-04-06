import React, { createContext, useState } from 'react';

export const EditContext = createContext();

const EditContextProvider = (props) => {
    const [show, setShow] = useState(false);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    return (
        <EditContext.Provider
            value={{ show, setShow, id, setId, title, setTitle, url, setUrl }}
        >
            {props.children}
        </EditContext.Provider>
    );
};

export default EditContextProvider;
