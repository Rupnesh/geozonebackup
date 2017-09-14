import { reset } from 'redux-form';

import { createAction, createRequestTypes } from '../../actions';
import {
    loginToWifiRequest
} from '../../services/api';

// Actions

const WIFI = createRequestTypes('WIFI');

export const login = {
    request: dispatch => dispatch(createAction(WIFI.REQUEST)),
    success: (dispatch, response, otherConfigurations) => {
        dispatch(createAction(WIFI.SUCCESS, { response }));
        reset('wifiForm');
    },
    failure: (dispatch, error) => {
        dispatch(createAction(WIFI.FAILURE, { error }));
    }
};

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

// Reducer

const initialState = {
    credentialsError: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case WIFI.REQUEST:
            return {
                ...state,
                credentialsError: false
            };
        case WIFI.SUCCESS:
            return {
                ...state,
                credentialsError: false
            };
        case WIFI.FAILURE:
            return {
                ...state,
                credentialsError: action.payload.error
            };
        default:
            return state;
    }
};
