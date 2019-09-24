
const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const REQUEST_LOAD_MORE = 'REQUEST_LOAD_MORE';
const SUCCESS_LOAD_MORE = 'SUCCESS_LOAD_MORE';
const FAILURE_LOAD_MORE = 'FAILURE_LOAD_MORE';



export const createRequestTypes = (base, withLoadMore = false) => {
  let types = [REQUEST, SUCCESS, FAILURE];
  if (withLoadMore) types = types.concat([REQUEST_LOAD_MORE, SUCCESS_LOAD_MORE, FAILURE_LOAD_MORE]);
  return (types.reduce((acc, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {}));
};

export const createAction = (type, payload = {}) => ({ type, payload });


// const fetchOffersSuccess = (payload, type ) =>{
//   return(
//   dispatch({type: 'success', payload: payload}))
// }
