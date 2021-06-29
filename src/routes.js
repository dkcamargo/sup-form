import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Seller from './pages/Seller';
import Survey from './pages/Survey';

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route component={Seller} path="/preventista"/>
                <Route component={Survey} path="/relevamiento/:id" />
                <Route component={Home} exact path="/"/>
            </Switch>
        </BrowserRouter>
    );
} 

export default Routes;