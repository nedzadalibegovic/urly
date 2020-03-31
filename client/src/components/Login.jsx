import { Formik } from 'formik';
import React, { useContext } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { TokenContext } from '../contexts/TokenContext';

const Login = () => {
    const { setToken } = useContext(TokenContext);
    const history = useHistory();

    const schema = yup.object({
        username: yup
            .string()
            .required()
            .min(4)
            .max(20),
        password: yup
            .string()
            .required()
            .min(8)
    });

    const auth = async ({ username, password }, { setStatus, resetForm }) => {
        const response = await fetch(process.env.REACT_APP_LOGIN, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const json = await response.json();

        if (response.ok) {
            // refreshToken should be automatically saved to browser as a cookie
            setToken(json.accessToken);
            history.push('/');
        } else {
            resetForm();
            setStatus(json.message);
        }
    };

    return (
        <Container className="login-page">
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={auth}
                validationSchema={schema}
                initialStatus={''}
            >
                {({
                    handleChange,
                    handleSubmit,
                    values,
                    touched,
                    errors,
                    status
                }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Username"
                                value={values.username}
                                onChange={handleChange}
                                isInvalid={touched.username && errors.username}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={values.password}
                                onChange={handleChange}
                                isInvalid={touched.password && errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {status ? (
                            <Alert variant="danger">{status}</Alert>
                        ) : null}

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};

export default Login;
