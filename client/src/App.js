import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Nav from './components/Nav';
import UrliesList from './components/UrliesList';
import EditContextProvider from './contexts/EditContext';
import TokenContextProvider from './contexts/TokenContext';
import UrliesContextProvider from './contexts/UrliesContext';

function App() {
    return (
        <Router>
            <TokenContextProvider>
                <UrliesContextProvider>
                    <Nav />
                    <Switch>
                        <Route component={Login} path="/login" exact />
                        <EditContextProvider>
                            <Route component={UrliesList} path="/" exact />
                        </EditContextProvider>
                    </Switch>
                </UrliesContextProvider>
            </TokenContextProvider>
        </Router>
    );
}

export default App;
