import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';

import Home from './pages/Home';
import Registration from './pages/registration/Registration';
import Login from './pages/login/Login';
import User from './pages/user/User';
import DataRequest from './pages/purchase/DataRequest';
import CheckoutPage from './pages/checkout/Checkout';
import AdminPage from './pages/admin/Admin';

const oktaConfig = {
  issuer: `${process.env.REACT_APP_OKTA_URL}/oauth2/default`,
  redirect_uri: `${window.location.origin}/implicit/callback`,
  client_id: process.env.REACT_APP_OKTA_ID,
  onAuthRequired: ({history}) => history.push('/login')
}

class App extends Component {
  render() {
    return (
      <Router>
          <Security {...oktaConfig}>
            <Route path='/implicit/callback' component={ImplicitCallback} />
            <Route path='/login' render={() => <Login baseUrl={process.env.REACT_APP_OKTA_URL} />} />
            <Route path='/register' component={Registration} />
            <Route exact path='/' component={Home} />
            <SecureRoute path='/user' component={User} />
            <SecureRoute path='/buydata' component={DataRequest} />
            <SecureRoute path='/makepayment' component={CheckoutPage} />
            <SecureRoute path='/admin' component={AdminPage} />
          </Security>
      </Router>
    );
  }
}

export default App;
