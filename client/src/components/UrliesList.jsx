import React, { useContext } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { UrliesContext } from '../contexts/UrliesContext';
import EditModal from './EditModal';
import Urly from './Urly';

const UrliesList = () => {
    const { urlies } = useContext(UrliesContext);

    return (
        <Container className="urlies-list">
            <EditModal />
            <Row>
                <Col>
                    <p>You have shortened {urlies.length} links in total</p>
                </Col>
                <Col>
                    <div className={'urlies-button'}>
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
                        {urlies.map((urly) => (
                            <Urly
                                id={urly._id}
                                title={urly.title}
                                url={urly.url}
                                key={urly._id}
                            />
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
};

export default UrliesList;
