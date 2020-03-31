import React from 'react';
import { Button } from 'react-bootstrap';

const Shorty = ({ title, url }) => {
    return (
        <tr>
            <td>{title}</td>
            <td>{url}</td>
            <td>
                <Button variant="primary" size="sm">
                    Edit
                </Button>
            </td>
        </tr>
    );
};

export default Shorty;
