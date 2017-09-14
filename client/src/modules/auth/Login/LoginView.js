import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Fields, reduxForm } from 'redux-form';

import { history } from '../../../utils/history';
import { regexEmail } from '../../../config';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  
  renderFields = fields => (
    <div>
      <div className='input-group mb-3'>
        <span className='input-group-addon'>@</span>
        <input className='form-control' {...fields.email.input} type='email'/>
      </div>
      {fields.email.meta.touched && fields.email.meta.error &&
      <div className='field-error'>{fields.email.meta.error}</div>}
      <div className='input-group mb-4'>
        <span className='input-group-addon'><i className='icon-lock'></i></span>
        <input className='form-control' {...fields.password.input} type='password'/>
      </div>
      {fields.password.meta.touched && fields.password.meta.error &&
      <div className='field-error'>{fields.password.meta.error}</div>}
    </div>
  );
  
  handleFormSubmit(props) {
    const { email, password } = props;
    this.props.loginUser(email, password);
  }
  
  forgottenPassword = () => {
    history.push('/forgotten-password');
  };
  register = () => {
    history.push('/register');
  };
  
  render() {
    const { handleSubmit, isPending, loginError } = this.props;
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
                        {loginError ? <span className='error'>{loginError}</span> : 'Sign In to your account'}
                      </p>
                      <Fields names={['email', 'password']} component={this.renderFields}/>
                      <div className='row'>
                        <div className='col-6'>
                          <button type='submit' className='btn btn-primary px-4' disabled={isPending}>Login</button>
                        </div>
                        <div className='col-6 text-right'>
                          <button onClick={this.forgottenPassword} type='button' className='btn btn-link px-0'>Forgot password?</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className='card card-inverse card-primary py-5' style={{ width: '40%' }}>
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
