import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import Seller from './pages/Seller';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Seller} path="/preventista"/>
            <Route component={Home} exact path="/"/>
        </BrowserRouter>
    );
} 

export default Routes;