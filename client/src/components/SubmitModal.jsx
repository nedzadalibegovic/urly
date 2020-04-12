import { useFormik } from 'formik';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Button, Form, Modal, Spinner, Tab } from 'react-bootstrap';
import * as yup from 'yup';
import { UrliesContext } from '../contexts/UrliesContext';

const SubmitModal = () => {
    const { addUrly } = useContext(UrliesContext);
    const [show, setShow] = useState(false);
    const [key, setKey] = useState(1);
    const [urly, setUrly] = useState(null);
    const shortenRef = useRef(null);

    const formik = useFormik({
        initialValues: {
            title: '',
            url: '',
        },
        onSubmit: async (values) => {
            try {
                setKey(3);
                const newUrly = await addUrly(values);
                formik.setStatus('');
                setUrly(newUrly);

                shortenRef.current.innerText = 'Copy';
                shortenRef.current.type = 'button';
                shortenRef.current.onclick = navigator.clipboard.writeText(
                    process.env.REACT_APP_REDIRECT + newUrly._id
                );
            } catch (err) {
                setKey(2);
                formik.setStatus(err.message);
            }
        },
        validationSchema: yup.object({
            title: yup.string().max(32).required('Cannot be empty'),
            url: yup.string().url('Must be a valid URL').required(),
        }),
        initialStatus: '',
        validateOnMount: true,
    });

    const handleClose = () => {
        setShow(false);
        formik.resetForm();
    };

    const handleShow = () => {
        setKey(1);
        setShow(true);
        setUrly(null);
        formik.resetForm();
    };

    useEffect(() => {
        (async () => {
            if (!formik.errors.url && formik.values.url !== '') {
                const response = await fetch(
                    'https://cors.nedzad.workers.dev/?' + formik.values.url
                );

                if (response.ok) {
                    const parser = new DOMParser();
                    const document = parser.parseFromString(
                        await response.text(),
                        'text/html'
                    );

                    formik.values.title = document.querySelector(
                        'title'
                    ).innerText;

                    setKey(2);
                }
            }
        })();
    }, [formik.values.url]);

    useEffect(() => {
        if (key === 2) shortenRef.current.disabled = formik.errors.title;
    }, [formik.errors.title]);

    return (
        <>
            <Button onClick={handleShow}>Shorten</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Shorten a URL</Modal.Title>
                </Modal.Header>
                <Form noValidate onSubmit={formik.handleSubmit}>
                    <Modal.Body className="modal-body-center">
                        <Tab.Container activeKey={key}>
                            <Tab.Content>
                                <Tab.Pane eventKey={1}>
                                    <Form.Group>
                                        <Form.Label>URL</Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...formik.getFieldProps('url')}
                                            isValid={
                                                !formik.errors.url &&
                                                formik.values.url !== ''
                                            }
                                        />
                                    </Form.Group>
                                </Tab.Pane>
                                <Tab.Pane eventKey={2}>
                                    <Form.Group>
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...formik.getFieldProps('title')}
                                            isValid={!formik.errors.title}
                                            isInvalid={formik.errors.title}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.title}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Tab.Pane>
                                <Tab.Pane
                                    eventKey={3}
                                    style={{ textAlign: 'center' }}
                                >
                                    {urly ? (
                                        <a
                                            href={
                                                process.env.REACT_APP_REDIRECT +
                                                urly._id
                                            }
                                            className="display-4"
                                            target="blank"
                                        >
                                            Open my Urly!
                                        </a>
                                    ) : (
                                        <Spinner
                                            animation="border"
                                            role="status"
                                        >
                                            <span className="sr-only">
                                                Loading...
                                            </span>
                                        </Spinner>
                                    )}
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>

                        {formik.status && (
                            <Alert variant="danger">{formik.status}</Alert>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button ref={shortenRef} type="submit" disabled>
                            Shorten!
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default SubmitModal;
