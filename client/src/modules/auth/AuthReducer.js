import { reset } from 'redux-form';
import axios from 'axios';

import { createAction, createRequestTypes } from '../../actions';
import { history } from '../../utils/history';
import {
  loginUserRequest,
  logoutUserRequest,
  registerCreateAccountRequest,
  verifyRegisterCodeRequest,
  forgottenPasswordRequest,
  resendCodeEmailRequest,
  getUserDataRequest
} from '../../services/api';
import auth from '../../utils/authentication';

// Helpers

const authenticationSuccess = (data) => { 
  auth.set({
    userId: data.user.id,
    token: data.token
  });
  axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
};

// Actions

const LOGIN = createRequestTypes('LOGIN');
export const LOGOUT = createRequestTypes('LOGOUT');
const REGISTER_CREATE_ACCOUNT = createRequestTypes('REGISTER_CREATE_ACCOUNT');
const REGISTER_VERIFY_ACCOUNT = createRequestTypes('REGISTER_VERIFY_ACCOUNT');
const FORGOTTEN_PASSWORD = createRequestTypes('FORGOTTEN_PASSWORD');
const RESEND_EMAIL = createRequestTypes('RESEND_EMAIL');
const RESET_RESENT_EMAIL = 'RESET_RESENT_EMAIL';

export const login = {
  request: dispatch => dispatch(createAction(LOGIN.REQUEST)),
  success: (dispatch, response, otherConfigurations) => {
    dispatch(createAction(LOGIN.SUCCESS, { response }));
    reset('loginForm');
    if (!otherConfigurations || (otherConfigurations && !otherConfigurations.registrationFlag)) {
      authenticationSuccess(response.data);
      history.push('/dashboard');
    }
  },
  failure: (dispatch, error) => {
    dispatch(createAction(LOGIN.FAILURE, { error }));
  }
};

export const logout = {
  request: dispatch => dispatch(createAction(LOGOUT.REQUEST)),
  success: (dispatch) => {
    dispatch(createAction(LOGOUT.SUCCESS));
    history.push('/login');
  },
  failure: (dispatch, error) => dispatch(createAction(LOGOUT.FAILURE, { error }))
};

export const registerCreate = {
  request: dispatch => dispatch(createAction(REGISTER_CREATE_ACCOUNT.REQUEST)),
  success: (dispatch, nextStep) => {
    reset('registerForm');
    dispatch(createAction(REGISTER_CREATE_ACCOUNT.SUCCESS));
    nextStep();
  },
  failure: (dispatch, error) => dispatch(createAction(REGISTER_CREATE_ACCOUNT.FAILURE, { error }))
};

export const registerVerify = {
  request: dispatch => dispatch(createAction(REGISTER_VERIFY_ACCOUNT.REQUEST)),
  success: (dispatch, nextStep, userData) => {
    const { email, password } = userData;
    dispatch(createAction(REGISTER_VERIFY_ACCOUNT.SUCCESS));
    reset('registerForm2');

    nextStep();

    loginUserRequest(email, password)
      .then(loginResponse => login.success(dispatch, loginResponse, { registrationFlag: true }))
      .catch((error) => {
        login.failure(dispatch, error.message);
      });
  },
  failure: (dispatch, error) => dispatch(createAction(REGISTER_VERIFY_ACCOUNT.FAILURE, { error }))
};

export const forgotPassword = {
  request: dispatch => dispatch(createAction(FORGOTTEN_PASSWORD.REQUEST)),
  success: (dispatch) => {
    reset('forgotPassForm');
    dispatch(createAction(FORGOTTEN_PASSWORD.SUCCESS));
    /*const backAction = history.goBack();
    dispatch(backAction);*/
  },
  failure: (dispatch, error) => {
      dispatch(createAction(FORGOTTEN_PASSWORD.FAILURE, {error}))
  }
};

export const resendCode = {
  request: dispatch => dispatch(createAction(RESEND_EMAIL.REQUEST)),
  success: (dispatch) => {
    dispatch(createAction(RESEND_EMAIL.SUCCESS));
  },
  failure: (dispatch, error) => dispatch(createAction(RESEND_EMAIL.FAILURE, { error }))
};

// Action creators
export const loginUser = (email, password) => (
  
  (dispatch) => {
    console.log(email, " ",password)
    loginUserRequest(email, password)
      .then(response => login.success(dispatch, response))
      .catch((error) => {
        switch (error.status) {
          case 403: {
            login.failure(dispatch, error.data.message);
            break;
          }
          default: {
            login.failure(dispatch, 'Login failed with unknown reason.');
            break;
          }
        }
      });
  }
);

export const logoutUser = () => (
  (dispatch) => {
    auth.clear();
    logoutUserRequest()
      .then(() => {
        logout.success(dispatch);
      })
      .catch(error => logout.failure(dispatch, error.data.message));
  }
);

export const registerCreateAccount = (userData, nextStep) => (
  (dispatch) => {
    registerCreate.request(dispatch);
    registerCreateAccountRequest(userData)
      .then(() => {
        registerCreate.success(dispatch, nextStep);
      })
      .catch((error) => {
        switch (error.status) {
          case 400:
          case 403:
          case 404: {
            registerCreate.failure(dispatch, error.data.message);
            break;
          }
          case 422 : {
            registerCreate.failure(dispatch, error.data.message);
            break;
          }
          default : {
            registerCreate.failure(dispatch, 'Registration failed for unknown reasons.');
          }
        }
      });
  }
);

export const registerVerifyAccount = (userData, nextStep) => (
  (dispatch) => {
    registerVerify.request(dispatch);
    verifyRegisterCodeRequest(userData)
      .then(() => {
        registerVerify.success(dispatch, nextStep, userData);
      })
      .catch((error) => {
        switch (error.status) {
          case 400:
          case 404: {
            registerCreate.failure(dispatch, error.data.message);
            break;
          }
          case 406 : {
            registerCreate.failure(dispatch, error.data.message);
            break;
          }
          default : {
            registerCreate.failure(dispatch, 'Registration failed for unknown reasons.');
          }
        }
      });
  }
);

export const resendCodeEmailValidation = userData => (
  (dispatch) => {
    resendCode.request(dispatch);
    resendCodeEmailRequest(userData)
      .then(() => {
        resendCode.success(dispatch);
      })
      .catch((error) => {
        switch (error.status) {
          case 400:
          case 404: {
            registerCreate.failure(dispatch, error.data.message);
            break;
          }
          default : {
            registerCreate.failure(dispatch, 'Registration failed for unknown reasons.');
          }
        }
      });
  }
);

export const forgottenPassword = (email) => (
  (dispatch) => {
    forgotPassword.request(dispatch);
    forgottenPasswordRequest(email)
      .then(() => forgotPassword.success(dispatch))
      .catch(error => forgotPassword.failure(dispatch, JSON.stringify(error)));
  }
);

export const getUserData = () => (
  (dispatch) => {
    const data = auth.get();
    if (!data) {
      return;
    }
    getUserDataRequest(data.userId)
      .then(response => {
        dispatch(createAction(LOGIN.SUCCESS, { response }));
      })
      .catch((error) => {
        switch (error.status) {
          case 403: {
            login.failure(dispatch, error.data.message);
            break;
          }
          default: {
            login.failure(dispatch, 'Login failed with unknown reason.');
            break;
          }
        }
      });
  }
);

//  this is used to reset the message that is shown after user clicks 'resend email'
export const resetResentEmail = () => (
  (dispatch) => {
    dispatch({ type: RESET_RESENT_EMAIL });
  }
);

// Reducer

const initialState = {
  isLogged: false,
  loginError: null,
  registerError: '',
  codeValidationError: null,
  isPending: false,
  userData: {},
  resentEmail: null,
  resendingEmail: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN.REQUEST:
      return {
        ...state,
        loginError: null,
        isPending: true
      };
    case LOGIN.SUCCESS:
      return {
        ...state,
        userData: action.payload.response.data.user,
        isLogged: true,
        isPending: false,
        loginError: null
      };
    case LOGIN.FAILURE:
      return {
        ...state,
        loginError: action.payload.error,
        isPending: false
      };
    case REGISTER_CREATE_ACCOUNT.REQUEST:
      return {
        ...state,
        registerError: '',
        creatingAccount: true
      };
    case REGISTER_CREATE_ACCOUNT.SUCCESS:
      return {
        ...state,
        registerError: '',
        creatingAccount: false
      };
    case REGISTER_CREATE_ACCOUNT.FAILURE:
      return {
        ...state,
        registerError: action.payload.error,
        creatingAccount: false
      };
    case REGISTER_VERIFY_ACCOUNT.REQUEST:
      return {
        ...state,
        codeValidationError: null,
        verifingRegisterCode: true,
        resentEmail: null
      };
    case REGISTER_VERIFY_ACCOUNT.SUCCESS:
      return {
        ...state,
        codeValidationError: null,
        validCode: true,
        verifingRegisterCode: false
      };
    case REGISTER_VERIFY_ACCOUNT.FAILURE:
      return {
        ...state,
        codeValidationError: action.payload.error,
        verifingRegisterCode: false
      };
    case FORGOTTEN_PASSWORD.REQUEST:
      return {
        ...state
      };
    case FORGOTTEN_PASSWORD.SUCCESS:
      return {
        ...state,
        forgottenMessage: {
            message: 'The email was successfully sent!',
            value: true
        }
      };
    case FORGOTTEN_PASSWORD.FAILURE:
      return {
        ...state,
          forgottenMessage: {
              message: 'The email was not sent!',
              value: false
          }
      };
    case RESEND_EMAIL.REQUEST:
      return {
        ...state,
        resendingEmail: true
      };
    case RESEND_EMAIL.SUCCESS:
      return {
        ...state,
        resendingEmail: false,
        resentEmail: {
          message: 'The email was successfully sent!',
          value: true
        }
      };
    case RESEND_EMAIL.FAILURE:
      return {
        ...state,
        resendingEmail: false,
        resentEmail: {
          message: 'The email was not sent.',
          value: false
        }
      };
    case RESET_RESENT_EMAIL:
      return {
        ...state,
        resentEmail: null
      };

    case LOGOUT.REQUEST:
      return {
        ...initialState
      };
    case LOGOUT.SUCCESS:
      return {
        ...initialState
      };
    case LOGOUT.FAILURE:
      return {
        ...initialState
      };
    default:
      return state;
  }
};
