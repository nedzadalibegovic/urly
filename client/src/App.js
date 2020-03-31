import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TokenContextProvider from './contexts/TokenContext';
import ShortiesContextProvider from './contexts/ShortiesContext';
import ShortiesList from './components/ShortiesList';
import Login from './components/Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <TokenContextProvider>
                <ShortiesContextProvider>
                    <Switch>
                        <Route component={Login} path='/login' exact />
                        <Route component={ShortiesList} path='/' exact />
                    </Switch>
                </ShortiesContextProvider>
            </TokenContextProvider>
        </Router>
    );
}

export default App;