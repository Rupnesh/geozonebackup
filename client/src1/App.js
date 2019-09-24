import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
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

// const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
//   return (
//     <Route
//       path={path}
//       {...rest}
//       render={(props) => {
//         return loggedIn ? (
//           <Comp {...props} />
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/",
//               state: {
//                 prevLocation: path,
//                 error: "You need to login first!",
//               },
//             }}
//           />
//         );
//       }}
//     />
//   );
// };


class App extends Component {

  state = {
    loggedIn: false,
  };

  componentWillMount() {
    // let authData = auth.get();
    let authData;

    

    auth.get().then((res) => {
      authData = res;


      configureDefaults();

      if (authData.token) {
        this.setState({loggedIn:true})
        history.push('/dashboard')

        // this.setState(
        //   {
        //     loggedIn: true,
        //   },
        //   () => {
        //     history.push( "/dashboard");
        //   },
        // );
      } else {
        history.push('/login')
      }

    })

    //console.log(authData)

  }

  

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path='/login' name='Login Page' component={Login} />
          <Route exact path='/register' name='Register Page' component={Register} />
          <Route exact path='/forgotten-password' name='Forgotten Password' component={ForgottenPassword} />
          <Route exact path='/404' name='Page 404' component={Page404} />
          <Route exact path='/500' name='Page 500' component={Page500} />
          <Route path='/' name='Home' component={Main} />
          {/* <ProtectedRoute path='/' loggedIn={this.state.loggedIn} name='Home' component={Main} /> */}
          
        </Switch>
      </Router>
    );
  }
}

export default connect()(App);
