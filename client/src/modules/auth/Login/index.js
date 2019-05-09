import { connect } from 'react-redux';

import LoginView from './LoginView';
import { loginUser, logoutUser } from '../AuthReducer';

const mapStateToProps = (state) => {
  const { loginError, isPending } = state.auth;
  return { loginError, isPending };
};

export default connect(mapStateToProps, {
  loginUser, logoutUser
})(LoginView);
