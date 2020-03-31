import React, { useContext } from 'react';
import { Table, Container } from 'react-bootstrap';
import { ShortiesContext } from '../contexts/ShortiesContext';
import Shorty from './Shorty';

const ShortiesList = () => {
    const { shorties } = useContext(ShortiesContext);

    return (
        <Container>
            <Table striped bordered hover className='shorties-list'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>URL</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {shorties.map(shorty => <Shorty title={shorty.title} url={shorty.url} key={shorty._id} />)}
                </tbody>
            </Table>
        </Container>
    );
};

export default ShortiesList;