import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import  {getListApiCall}  from './LoggingReducer'
import LoggingView from './LoggingView';

function mapStateToProps(state) {
    return {
      posts: state.posts,
      comments: state.comments,
      getList: state.loggingData.getList
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      getListApiCall: getListApiCall
    }, dispatch)
  }

export default connect(mapStateToProps, mapDispatchToProps)(LoggingView); 
