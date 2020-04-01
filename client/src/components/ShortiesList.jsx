import React, { useContext } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { ShortiesContext } from '../contexts/ShortiesContext';
import Shorty from './Shorty';

const ShortiesList = () => {
    const { shorties } = useContext(ShortiesContext);

    return (
        <Container className="shorties-list">
            <Row>
                <Col>
                    <p>You have shortened {shorties.length} links in total</p>
                </Col>
                <Col>
                    <div className={'shorties-button'}>
                        <Button>Shorten</Button>
                    </div>
                </Col>
            </Row>
            <Row style={{ paddingTop: '10px' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>URL</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {shorties.map(shorty => (
                            <Shorty
                                title={shorty.title}
                                url={shorty.url}
                                key={shorty._id}
                            />
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
};

export default ShortiesList;
