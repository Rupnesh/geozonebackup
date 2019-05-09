import { connect } from 'react-redux';

import RegisterView from './RegisterView';
import { registerCreateAccount } from '../AuthReducer';

const mapStateToProps = (state) => {
  const { registerError, isPending } = state.auth;
  return { registerError, isPending };
};

export default connect(mapStateToProps, {
  registerCreateAccount
})(RegisterView);
