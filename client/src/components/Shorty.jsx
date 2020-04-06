import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { EditContext } from '../contexts/EditContext';

const Shorty = ({ id, title, url }) => {
    const { setShow, setId, setTitle, setUrl } = useContext(EditContext);

    const showModal = () => {
        setId(id);
        setTitle(title);
        setUrl(url);
        setShow(true);
    };

    return (
        <tr>
            <td>{title}</td>
            <td>{url}</td>
            <td>
                <div className={'shorties-button'}>
                    <Button onClick={showModal}>Edit</Button>
                </div>
            </td>
        </tr>
    );
};

export default Shorty;
