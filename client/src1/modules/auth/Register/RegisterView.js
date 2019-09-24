import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Fields, reduxForm } from 'redux-form';
import classNames from 'classnames';

import { history } from '../../../utils/history';
import { regexEmail, regexPhone } from '../../../config';

class RegisterView extends Component {
  
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  
  renderFields = (fields) => {
    Object.keys(fields).forEach((item) => {
      const field = fields[item];
      const meta = field.meta;
      if (!meta) return;
      field.inputClassNames = classNames(
        'form-control',
        { 'form-control-warning': meta.touched && meta.error },
        { 'form-control-success': meta.touched && !meta.error }
      );
      field.groupClassNames = classNames(
        'input-group',
        'mb-3',
        { 'has-warning': meta.touched && meta.error },
        { 'has-success': meta.touched && !meta.error }
      );
    });
    return (
      <div>
        <div className={fields.firstName.groupClassNames}>
          <span className='input-group-addon'><i className='icon-user'></i></span>
          <input className={fields.firstName.inputClassNames} {...fields.firstName.input} type='text' placeholder='First Name'/>
        </div>
      
        <div className={fields.lastName.groupClassNames}>
          <span className='input-group-addon'><i className='icon-user'></i></span>
          <input className={fields.lastName.inputClassNames} {...fields.lastName.input} type='text' placeholder='Last Name'/>
        </div>
      
        <div className={fields.email.groupClassNames}>
          <span className='input-group-addon'>@</span>
          <input className={fields.email.inputClassNames} {...fields.email.input} type='email' placeholder='Email'/>
        </div>
      
        <div className={fields.password.groupClassNames}>
          <span className='input-group-addon'><i className='icon-lock'></i></span>
          <input className={fields.password.inputClassNames} {...fields.password.input} type='password' placeholder='Password'/>
        </div>
      
        <div className={fields.repassword.groupClassNames}>
          <span className='input-group-addon'><i className='icon-lock'></i></span>
          <input className={fields.repassword.inputClassNames} {...fields.repassword.input} type='password' placeholder='Repeat Password'/>
        </div>
      
        <div className={fields.phone.groupClassNames}>
          <span className='input-group-addon'><i className='icon-phone'></i></span>
          <input className={fields.phone.inputClassNames} {...fields.phone.input} type='phone' placeholder='Phone Number'/>
        </div>
      
        <div className={fields.team.groupClassNames}>
          <span className='input-group-addon'><i className='icon-people'></i></span>
          <input className={fields.team.inputClassNames} {...fields.team.input} type='text' placeholder='Your Team Name'/>
        </div>
      </div>
    );
  };
  
  goBack = () => {
    history.goBack();
  };
  
  handleFormSubmit(props) {
    const { firstName, lastName, email, password, phone, team } = props;
    this.props.registerCreateAccount(firstName, lastName, email, password, phone, team);
  }
  
  render() {
    const { handleSubmit, isPending, registerError } = this.props;
    
    return (
      <div className='app flex-row align-items-center'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <div className='card mx-4'>
                <div className='card-block p-4'>
                  <form onSubmit={handleSubmit(this.handleFormSubmit)}>
                    <h1>Register</h1>
                    {!registerError
                      ? <p className='text-muted'>* All Fields are required. Create your account now and have your team communicate accordingly</p>
                      : <p className='error'>{registerError}</p> }
                    <Fields
                      names={['firstName', 'lastName', 'email', 'password', 'repassword', 'phone', 'team']}
                      component={this.renderFields}
                    />
                    <button type='submit' className='btn btn-block btn-success' disabled={isPending}>Create Account</button>
                  </form>
                </div>
                <div className='card-footer text-center'>
                  <div className='row align-items-center '>
                    <div className='col-12 align-items-center'>
                      <p className='text-muted'>Already have an account?</p>
                      <button onClick={this.goBack} className='btn btn-block btn-primary' type='button'>Go back to Login</button>
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
  const requiredFields = ['firstName', 'lastName', 'email', 'password', 'repassword', 'phone', 'team'];
  requiredFields.forEach((f) => {
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
        case 'repassword': {
          if (text !== props.password) {
            errorMessage = 'Re-entered password does not match the current password';
          }
          break;
        }
        case 'phone': {
          if (!regexPhone.test(text)) {
            errorMessage = 'Phone number is invalid';
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

RegisterView.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  registerCreateAccount: PropTypes.func.isRequired
};

RegisterView.defaultProps = {
  registerError: '',
  isPending: false
};

export default reduxForm({
  form: 'registerForm',
  validate
})(RegisterView);

