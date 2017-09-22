import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { history } from './utils/history';
import auth from './utils/authentication';
import { verifyTokenAvailability, configureDefaults } from './services/api';

// Containers
import Main from './containers/Main';

// Views
import Login from './modules/auth/Login';
import Register from './modules/auth/Register';
import ForgottenPassword from './modules/auth/ForgottenPassword';
import Page404 from './modules/error/Page404';
import Page500 from './modules/error/Page500';

class App extends Component {
  
  componentWillMount() {
    const authData = auth.get();
  
    configureDefaults();

    /*if (authData.token) {
      verifyTokenAvailability(authData.token)
        .then(() => {
          history.push('/dashboard')
        })
        .catch(() => {
          history.push('/login')
        });
    } else {
      history.push('/login')
    }*/
    history.push('/dashboard')
  }
  
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path='/login' name='Login Page' component={Login}/>
          <Route exact path='/register' name='Register Page' component={Register}/>
          <Route exact path='/forgotten-password' name='Forgotten Password' component={ForgottenPassword}/>
          <Route exact path='/404' name='Page 404' component={Page404}/>
          <Route exact path='/500' name='Page 500' component={Page500}/>
          <Route path='/' name='Home' component={Main}/>
        </Switch>
      </Router>
    );
  }
}

export default connect()(App);
