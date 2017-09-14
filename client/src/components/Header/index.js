import { connect } from 'react-redux';
import HeaderView from './HeaderView';

import { logoutUser } from '../../modules/auth/AuthReducer';

const mapStateToProps = (state) => {
  const { userData } = state;
  return { userData };
};

export default connect(mapStateToProps, {
  logoutUser
})(HeaderView);
