import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Fields, reduxForm } from 'redux-form';
import classNames from 'classnames';

import { history } from '../../../utils/history';
import { regexEmail } from '../../../config';

class ForgottenPasswordView extends Component {

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
                <div className={fields.email.groupClassNames}>
                    <span className='input-group-addon'>@</span>
                    <input className={fields.email.inputClassNames} {...fields.email.input} type='email' placeholder='Email'/>
                </div>
            </div>
        );
    };

    goBack = () => {
        history.goBack();
    };

    handleFormSubmit(props) {
        const { email } = props;
        this.props.forgottenPassword(email);
    }

    render() {
        const { handleSubmit, isPending, forgottenMessage } = this.props;

        return (
            <div className='app flex-row align-items-center'>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-md-6'>
                            <div className='card mx-4'>
                                <div className='card-block p-4'>
                                    <form onSubmit={handleSubmit(this.handleFormSubmit)}>
                                        <h1>Forgot Password</h1>
                                        {forgottenMessage.value
                                            ? <p className='text-muted'>Please input the email of the account</p>
                                            : <p className='error'>{forgottenMessage.message}</p> }
                                        <Fields
                                            names={['email']}
                                            component={this.renderFields}
                                        />
                                        <button type='submit' className='btn btn-block btn-success' disabled={isPending}>Send Email</button>
                                    </form>
                                </div>
                                <div className='card-footer text-center'>
                                    <div className='row'>
                                        <div className='col-8 align-content-center'>
                                            <p className='text-muted'>Found out your password already?</p>
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

const validate = (values, props) => {
    const errors = {};
    const requiredFields = ['email'];
    requiredFields.forEach((f) => {
        let errorMessage = '';
        if (!(f in values)) {
            errorMessage = 'Field is required';
        } else {
            const text = values[f];

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

ForgottenPasswordView.propTypes = {
    forgottenPassword: PropTypes.func.isRequired
};

ForgottenPasswordView.defaultProps = {
    forgottenMessage: {
        value: true
    },
    isPending: false
};

export default reduxForm({
    form: 'forgotPassForm',
    validate
})(ForgottenPasswordView);

