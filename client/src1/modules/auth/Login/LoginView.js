import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Fields, reduxForm } from 'redux-form';

import { history } from '../../../utils/history';
import { regexEmail } from '../../../config';
import auth from '../../../utils/authentication';

import { GETAPI, POSTAPI, postAPI1, AxiosPromise } from '../../../services/fetchAPI';
import { api } from '../../../../src/config/api';

const UserCredential = [
  {
    firstname: 'Dominic',
    lastname: 'Staufer',
    email: 'dominic@geozone.ch',
    password: 'geozone2017'
  },
  {
    firstname: 'Andrei',
    lastname: 'Lakatos',
    email: 'andrei@mcro-e.com',
    password: 'geozone2017'
  },
  {
    firstname: 'Alex',
    lastname: 'Lazar',
    email: 'alex@mcro-e.com',
    password: 'geozone2017'
  },
  {
    firstname: 'Ian',
    lastname: 'Peters',
    email: 'ian@geozone.ch',
    password: 'geozone2017'
  },
  {
    firstname: 'Damon',
    lastname: 'Hermann',
    email: 'damon@geozone.ch',
    password: 'geozone2017'
  },
  {
    firstname: 'Kuzo',
    lastname: 'Kuzo',
    email: 'kuzo@geozone.ch',
    password: 'geozone2017'
  },
  {
    firstname: 'Demo',
    lastname: 'Demo',
    email: 'demo@geozone.ch',
    password: 'geozone2017'
  }
]

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.state = {
      loginError: ''
    }
  }

  renderFields = fields => (
    <div>
      <div className='input-group mb-3'>
        <span className='input-group-addon'>@</span>
        <input className='form-control' {...fields.email.input} type='text' />
      </div>
      {/* {fields.email.meta.touched && fields.email.meta.error &&
        <div className='field-error'>{fields.email.meta.error}</div>} */}
      <div className='input-group mb-4'>
        <span className='input-group-addon'><i className='icon-lock'></i></span>
        <input className='form-control' {...fields.password.input} type='password' />
      </div>


      {/* { fields.password.meta.untouched && !fields.password.meta.error &&
        <div className='field-error'>&nbsp;</div>} */}
        


      { (fields.password.meta.touched && fields.password.meta.error) ? <div className='field-error'>{fields.password.meta.error}</div> 
      : <div style={{marginTop: '-20px', marginBottom: '10px', color: '#f86c6b'}}>&nbsp;</div> }
      
      

      {/* {fields.password.meta.touched && fields.password.meta.error &&
        <div className='field-error'>{fields.password.meta.error}</div>} */}
    </div>
  );

  handleFormSubmit(props) {
    const { email, password } = props;
    this.loginUser(email, password);
  }

  loginUser = (email, password) => {
    UserCredential.map((val, index) => {
      if (val.email === email && val.password === password) {
        auth.set({
          userId: val.firstname,
          token: val.email
        });
        history.push('/dashboard');
      } else {
        return this.setState({ loginError: "Login failed with unknown reason." })
      }
    })

    // let data = { "username" : email, "password" : password+ "-Geozone" }

    // AxiosPromise.post(api.login, data)
    // .then(response => {
    //   if(response.status) {
    //     auth.setAuth({
    //       status: response.status,
    //       serial_number: response.serial_number,
    //       user_id: email
    //     });
    //     history.push('/dashboard');
    //   }
    //   else {
    //     return this.setState({ loginError: "Login failed with unknown reason." })
    //   }
    // })
    // .catch(error =>
    //   console.log("error", error));
  }


  forgottenPassword = () => {
    history.push('/forgotten-password');
  };
  register = () => {
    history.push('/register');
  };

  render() {
    const { handleSubmit, isPending } = this.props;
    return (
      <div className='app flex-row align-items-center'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-8'>
              <div className='card-group mb-0'>
                <div className='card p-4'>
                  <div className='card-block'>
                    <form onSubmit={handleSubmit(this.handleFormSubmit)}>
                      <h1>Login</h1>
                      <p className='text-muted'>
                        {this.state.loginError ? <span className='error'>{this.state.loginError}</span> : 'Sign In to your account'}
                      </p>
                      <Fields names={['email', 'password']} component={this.renderFields} />
                      <div className='row'>
                        <div className='col-6'>
                          <button type='submit' className='btn btn-primary px-4' disabled={isPending}>Login</button>
                        </div>
                        <div className='col-6 text-right d-none'>
                          <button onClick={this.forgottenPassword} type='button' className='btn btn-link px-0'>Forgot password?</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className='card card-inverse card-primary py-5 d-none' style={{ width: '40%' }}>
                  <div className='card-block text-center'>
                    <div>
                      <h2>Sign up</h2>
                      <p>Create an account for free and have your own team communicate</p>
                      <button onClick={this.register} type='button' className='btn btn-primary active mt-3'>Register Now!</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const validate = (props) => {
  const errors = {};
  const fields = ['email', 'password'];
  fields.forEach((f) => {
    let errorMessage = '';
    if (!(f in props)) {
      errorMessage = 'Field is required';
    } else {
      const text = props[f];

      switch (f) {
        case 'email': {
          if (!regexEmail.test(text)) {
            errorMessage = 'Email format is wrong';
          }
          break;
        }
        default:
          break;
      }
    }
    errors[f] = errorMessage;
  });
  return errors;
};

LoginView.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired
};

LoginView.defaultProps = {
  loginError: '',
  isPending: false
};

export default reduxForm({
  form: 'loginForm',
  validate
})(LoginView);
