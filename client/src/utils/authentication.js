/* globals localStorage */

const AUTHENTICATION_STORAGE_KEY = 'MCallAuthorization';
const AUTHENTICATION_USER_DATA = 'UserId';

const AUTHENTICATION_STATUS = "status";
const AUTHENTICATION_LOGIN_STATUS = "login_status"
const AUTHENTICATION_USER_ID = "UserId"

const Storage = localStorage;

export default {

  async get() {
    const userid = await Storage.getItem(AUTHENTICATION_USER_DATA);
    const usertoken = await Storage.getItem(AUTHENTICATION_STORAGE_KEY)
    let user={
      userId: userid,
      token: usertoken
    }
    return user;
    
  },

  get1() {
    return {
      userId: Storage.getItem(AUTHENTICATION_USER_DATA),
      token: Storage.getItem(AUTHENTICATION_STORAGE_KEY)
    };
  },
  set(data) {
    Storage.setItem(AUTHENTICATION_STORAGE_KEY, data.token);
    Storage.setItem(AUTHENTICATION_USER_DATA, data.userId);

  },
  clear() {
    Storage.removeItem(AUTHENTICATION_STORAGE_KEY);
    Storage.removeItem(AUTHENTICATION_USER_DATA);

    Storage.removeItem(AUTHENTICATION_STATUS);
    Storage.removeItem(AUTHENTICATION_LOGIN_STATUS);
    Storage.removeItem(AUTHENTICATION_USER_ID);
  },
  setAuth(data) {
    Storage.setItem(AUTHENTICATION_STATUS, data.status);
    Storage.setItem(AUTHENTICATION_LOGIN_STATUS, data.login_status);
    Storage.setItem(AUTHENTICATION_USER_ID, data.user_id);
    console.log( Storage.getItem(AUTHENTICATION_USER_ID))
  },
  getAuth() {
      return {
        status: Storage.getItem(AUTHENTICATION_STATUS),
        login_status: Storage.getItem(AUTHENTICATION_LOGIN_STATUS),
        userId:  Storage.getItem(AUTHENTICATION_USER_ID),
      };
    

  },
 
};
