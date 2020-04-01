import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Nav from './components/Nav';
import ShortiesList from './components/ShortiesList';
import ShortiesContextProvider from './contexts/ShortiesContext';
import TokenContextProvider from './contexts/TokenContext';

function App() {
    return (
        <Router>
            <TokenContextProvider>
                <ShortiesContextProvider>
                    <Nav />
                    <Switch>
                        <Route component={Login} path="/login" exact />
                        <Route component={ShortiesList} path="/" exact />
                    </Switch>
                </ShortiesContextProvider>
            </TokenContextProvider>
        </Router>
    );
}

export default App;
