//import {BARCODE_SCANNER_SEARCH} from '../actions/barcodeScanner';
import { createAction, createRequestTypes } from '../../actions';
import { getApiCall } from '../../services/api'

const LOGGING = createRequestTypes('LOGGING');

export const logging = {
    request: dispatch => dispatch(createAction(LOGGING.REQUEST)),
    success: (dispatch, response, otherConfigurations) => {
      dispatch(createAction(LOGGING.SUCCESS, { response }));
    },
    failure: (dispatch, error) => {
      dispatch(createAction(LOGGING.FAILURE, { error }));
    }
  };



  export const getListApiCall = (url) =>(
    (dispatch) => {
     getApiCall(url).then((response)=>{
        logging.success(dispatch, response)
    }).catch((error) => {
        switch (error.status) {
          case 403: {
            logging.failure(dispatch, error.data.message);
            break;
          }
          default: {
            logging.failure(dispatch, 'logging failed with unknown reason.');
            break;
          }
        }
    })
  }
  )


const initialState = {
  value:''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGGING.REQUEST:
      return {
        ...state,
        initialState
       
      };
    case LOGGING.SUCCESS:
      return {
        ...state,
        getList: action.payload.response
       
      };
    case LOGGING.FAILURE:
      return {
        ...state,
        initialState

      };
    default: return state;
  }
}
