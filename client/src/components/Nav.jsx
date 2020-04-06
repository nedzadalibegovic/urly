import React, { useContext } from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TokenContext } from '../contexts/TokenContext';

const Nav = () => {
    const { token, setToken } = useContext(TokenContext);

    const logout = async () => {
        await fetch(process.env.REACT_APP_LOGIN, {
            method: 'DELETE',
            credentials: 'include',
        });
        setToken('');
    };

    return (
        <Container>
            <Navbar>
                <Navbar.Brand>
                    <h3>Urly</h3>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {token && (
                            <Link to={{ pathname: '/login' }} onClick={logout}>
                                Log out
                            </Link>
                        )}
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        </Container>
    );
};

export default Nav;
