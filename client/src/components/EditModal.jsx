import { useFormik } from 'formik';
import React, { useContext, useEffect } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import * as yup from 'yup';
import { EditContext } from '../contexts/EditContext';
import { UrliesContext } from '../contexts/UrliesContext';

const EditModal = () => {
    const { id, show, setShow, title, url } = useContext(EditContext);
    const { editUrly } = useContext(UrliesContext);

    const formik = useFormik({
        initialValues: {
            title: title,
            url: url,
        },
        onSubmit: async (values, { setStatus }) => {
            try {
                const urly = {
                    _id: id,
                    title: values.title,
                    url: values.url,
                };

                await editUrly(urly);
            } catch (err) {
                setStatus(err.message);
            }
        },
        validationSchema: yup.object({
            title: yup.string().required('Cannot be empty'),
            url: yup.string().url('Must be a valid URL').required(),
        }),
        initialStatus: '',
    });

    const handleClose = () => setShow(false);

    useEffect(() => {
        formik.resetForm();
    }, [show]);

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Form noValidate onSubmit={formik.handleSubmit}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            {...formik.getFieldProps('title')}
                            isInvalid={
                                formik.errors.title && formik.touched.title
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.title}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>URL</Form.Label>
                        <Form.Control
                            type="text"
                            {...formik.getFieldProps('url')}
                            isInvalid={formik.errors.url && formik.touched.url}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.url}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {formik.status && (
                        <Alert variant="danger">{formik.status}</Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditModal;
