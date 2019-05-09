import { reset } from 'redux-form';

import { createAction, createRequestTypes, getListData } from '../../actions';
import {
    loginToWifiRequest, getWIFIList
} from '../../services/api';

// Actions

const Licenses = createRequestTypes('licenses');

export const licensesOptionStatus = Data => ((dispatch, getState) => {
    createAccountRequest(accountData)
    .then((response) => {
      if (response.success) {
            dispatch(createAction(Licenses.SUCCESS, { response }));
        }
    }) .catch(() => loginAction.failure(dispatch, loginFailureData));
        
    })



// Action creators
export const loginToWifi = (username, password) => ( 
    (dispatch) => {
        login.request(dispatch);
        loginToWifiRequest(username, password)
            .then(response => login.success(dispatch, response))
            .catch((error) => {
                console.log(error);
                login.failure(dispatch, 'Login failed with unknown reason.');
            });
    }
);

// Get WIFI list
// export const getWiFiList = () => ( 
    
//     (dispatch) => {
//         console.log("Callllllllll")
//         getWIFIList()
//             .then(response => login.success(dispatch, response))
//             .catch((error) => {
//                 console.log(error);
//                 login.failure(dispatch, 'Error while fetching data.');
//             });
//     }
// );



// Reducer

const initialState = {
    credentialsError: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case Licenses.REQUEST:
            return {
                ...state,
                credentialsError: false
            };
        case Licenses.SUCCESS:
            return {
                ...state,
                credentialsError: false
            };
        case Licenses.FAILURE:
            return {
                ...state,
                credentialsError: action.payload.error
            };
        default:
            return state;
    }
};
