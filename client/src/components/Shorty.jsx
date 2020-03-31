import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const Shorty = ({ title, url }) => {
    return (
        <tr>
            <td>{title}</td>
            <td>{url}</td>
            <td><Button variant="primary" size="sm">Edit</Button></td>
        </tr>
    );
};

Shorty.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
};

export default Shorty;