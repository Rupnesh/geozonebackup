import { connect } from 'react-redux';
import HeaderView from './HeaderView';

import { logoutUser, getUserData } from '../../modules/auth/AuthReducer';

const mapStateToProps = (state) => {
  const { auth } = state;
  const { userData } = auth;

  return { userData };
};

export default connect(mapStateToProps, {
  logoutUser,
  getUserData
})(HeaderView);
