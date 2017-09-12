/**
 * Created by mariuspotor on 18/11/2016.
 */
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports.validateToken = (req) => {
  let response = {};
  let token = '';
  
  if (req.headers.authorization !== undefined) {
    token = req.headers.authorization.split('Bearer ')[1];
  }

  if (token === '') {
    response = {
      status: 402,
      success: false,
      message: 'Missing authorization token!'
    };
    return response;
  }
  
  let tokenInfo = {};
  try {
    tokenInfo = jwt.verify(token, secret);
  } catch (JsonWebTokenError) {
    response = {
      status: 401,
      success: false,
      message: 'Invalid token or expired!'
    };
    return response;
  }

  if (tokenInfo.id === undefined) {
    response = {
      status: 404,
      success: false,
      message: 'Unknown token owner'
    };
    return response;
  }

  response = {
    status: 200,
    success: true,
    data: tokenInfo
  };
  return response;
};

