import { connect } from 'react-redux';

import WifiView from './WifiView';
import { loginToWifi } from '../ConnectionReducer';

const mapStateToProps = (state) => {
    const { credentialsError } = state.connection;

    return { credentialsError };
};

export default connect(mapStateToProps, {
    loginToWifi
})(WifiView);
