import { constants } from '../config/constants';
import axios from 'axios';

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.

var headers = { 'Content-Type': 'application/json' };
export const GETAPI = api => fetch(constants.host + api)
    .then(res => res.json())
    .then(data => data)
    .catch((error) => {
      console.log(error);
      return error;
    });
export const GETAPIFlask = api => fetch(constants.hostflask + api)
    .then(res => res.json())
    .then(data => data)
    .catch(error => Promise.reject(error));

export const POSTAPI = (api, data) => fetch(constants.host + api, {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data) // body data type must match "Content-Type" header
})
    .then(res => res.json())
    .then(data => Promise.resolve(data))
    .catch(error => Promise.reject(error));

// export const postApiFlask = (api, data) => {
// return fetch(constants.hostflask + api, {
// method: "POST", // *GET, POST, PUT, DELETE, etc.
// body: JSON.stringify(data), // body data type must match "Content-Type" header
// })
// .then(res => res.json() )
// .then(data => {
// return data
// })
// .catch((error) => {
// return Promise.reject(error);
// });
// }

export const postApiFlask = (api, data) => axios
    .post(`${constants.hostflask}${api}`, data)
    .then(response => response)
    .catch(error => Promise.reject(error));

export const AxiosPromise = {
  // making of custom object in required format

  axios(type, url, data, headerData, disableLoader) {
    disableLoader = disableLoader;

    let processData;
    let opts = {
      url,

      method: type,

      responseType: 'json',

      data,

      timeout: 1000,

      headers: headerData
    };

    // Add a request interceptor

    axios.interceptors.request.use(
      config => config,
      error => Promise.reject(error)
    );

    return axios(opts);
  },
  // GET function callback

  async get(url, headerData, nodeBackEnd) {
    return nodeBackEnd
      ? axios.get(constants.hostNodeBackEnd + url, headerData, nodeBackEnd)
      : axios
          .get(constants.hostflask + url, headerData, nodeBackEnd)

          .then(response => response)

          .catch((error) => {
            if (error && error.response.status === 503) {
              window.location.reload();
            } else return Promise.reject(error);
          });
  },
  // POST function callback

  async post(url, data, headerData, disableLoader) {
    return axios
      .post(constants.hostflask + url, data, headerData, disableLoader)

      .then(response => response)

      .catch(error => Promise.reject(error));
  },
  // PUT function callback

  async put(url, data, contentType, disableLoader) {
    return axios
      .put(constants.hostflask + url, data, contentType)

      .then(response => response)

      .catch(error => Promise.reject(error));
  },
  // PATCH function callback

  patch(url, data, contentType, disableLoader) {
    return this.axios('PATCH', constants.hostflask + url, data, contentType, disableLoader)

      .then(response => response)

      .catch(error => Promise.reject(error));
  },
  // DELETE function callback

  async delete(url, data, headerData, disableLoader) {
    return this.axios('DELETE', constants.hostflask + url, data, headerData, disableLoader)

      .then(response => response)

      .catch(error => Promise.reject(error));
  }
};

// Todo: error handle need to be done

// let failureCallback = function (disableLoader, oError) {

// console.log(oError)

// if (oError.response && oError.response.code == 401) {

// this.dropdown.alertWithType('error', 'Error', strings.noResponse)

// }else if(oError.response && oError.response.code == 402){

// alert(`Please provide valid details `)

// }else if(oError.response && oError.response.code == 403){

// alert(`Please provide valid details `)

// }else if(oError.response && oError.response.code == 404){

// alert(`Please provide valid details `)

// }else if(oError.response && oError.response.code == 409){

// alert(`Please provide valid details `)

// }else if(oError.response && oError.response.code == 429){

// alert(`Please provide valid details `)

// }else if(oError.response && oError.response.code == 504){

// alert(`Please provide valid details `)

// }else{

// alert(`Please provide valid details `)

// // let responseObject = {

// // errorCode: "999999",

// // response: "Server Not Responded",

// // status: "FAILURE"

// // };

// // return responseObject

// }

// };
