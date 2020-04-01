import React from 'react';
import { Button } from 'react-bootstrap';

const Shorty = ({ title, url }) => {
    return (
        <tr>
            <td>{title}</td>
            <td>{url}</td>
            <td>
                <div className={'shorties-button'}>
                    <Button>Edit</Button>
                </div>
            </td>
        </tr>
    );
};

export default Shorty;
