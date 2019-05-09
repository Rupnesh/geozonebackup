import { connect } from 'react-redux';

import ForgottenPasswordView from './ForgottenPasswordView';

import { forgottenPassword } from '../AuthReducer';

const mapStateToProps = (state) => {
    const { forgottenMessage } = state.auth;
    return { forgottenMessage };
};

export default connect(mapStateToProps, {
    forgottenPassword
})(ForgottenPasswordView);
