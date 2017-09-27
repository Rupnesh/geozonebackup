import axios from 'axios';

import auth from '../utils/authentication';

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(config) {
  return new Promise((resolve, reject) => {
    axios(config)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
}

//  I COMMENTED THE CODE UNTIL THE APIs ARE READY
// api services
export const loginUserRequest = (email, password) => {
  const object = {
    email,
    password
  };

   return callApi({
    url: '/login',
    method: 'post',
    data: JSON.stringify(object)
  });
  /*return new Promise((resolve, reject) => {
    resolve({ status: 200, user: { name: 'Alexandru Lazar', email: 'alex@mcro-e.com' } });
    if (object === null) {
      reject({ message: 'nothing' });
    }
  });*/
};

export const verifyTokenAvailability = (token) => {
  const object = {
    token
  };
  
  return callApi({
    url: '/auth',
    method: 'post',
    data: JSON.stringify(object)
  });
  /*return new Promise((resolve, reject) => {
   resolve({ status: 200, user: { name: 'Alexandru Lazar', email: 'alex@mcro-e.com' } });
   if (object === null) {
   reject({ message: 'nothing' });
   }
   });*/
};

export const getUserDataRequest = (id) => {
  return callApi({
    url: '/users/' + id,
    method: 'get'
  });
};

export const logoutUserRequest = () => {
  /* return callApi({
   url: '/oauth/token',
   method: 'post',
   data: JSON.stringify(object)
   });*/
  let success = true;
  return new Promise((resolve, reject) => {
    resolve({ status: 200, success: true });
    if (!success) {
      reject({ message: 'Could not log the user out' });
    }
  });
};

export const registerCreateAccountRequest = (userData => callApi({
  url: '/team/register',
  method: 'post',
  data: JSON.stringify(userData)
}));

export const verifyRegisterCodeRequest = ({ email, code }) => callApi({
  url: '/team/verifyCode',
  method: 'post',
  data: JSON.stringify({
    email,
    code
  })
});

export const resendCodeEmailRequest = ({ email }) => callApi({
  url: '/team/resendCode',
  method: 'post',
  data: JSON.stringify({
    email
  })
});

//  Simulated a successful answer
export const forgottenPasswordRequest = ({ email }) => {
  const object = {
    email,
    grant_type: 'password',
    client_id: 'aefe9131-a89c-4e03-9b11-c8f683c66666',
    client_secret: 'drupalsoftare'
  };

  /*callApi({
    url    : '/team/forgottenPassword',
    method : 'POST',
    data   : email
  });*/

  return new Promise((resolve, reject) => {
    /*resolve({ status: 200, success: true });*/
      reject({ message: 'nothing' });
    if (object === null) {
      reject({ message: 'nothing' });
    }
  });
};

// export const loginUserFacebookRequest = authData => new Promise((resolve, reject) => {
//   resolve({ key: 'value' });
// });

export const loginToWifiRequest = (username, password) => {
    const object = {
        username,
        password
    };

  /* return callApi({
   url: '/oauth/token',
   method: 'post',
   data: JSON.stringify(object)
   });*/
    return new Promise((resolve, reject) => {
        resolve({ status: 200, success: true });

        if (object === null) {
            reject({ message: 'nothing' });
        }
    });
};

export const configureDefaults = async () => {
  let URL = `${window.location.protocol}//${window.location.hostname}:8080`;
  if (process.env.NODE_ENV === 'production') {
    URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  }
  axios.defaults.baseURL = `${URL}/v1`;
  const data = auth.get();
  axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.post.Accept = 'application/json';
};
