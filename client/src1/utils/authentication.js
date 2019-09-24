/* globals localStorage */

const AUTHENTICATION_STORAGE_KEY = 'MCallAuthorization';
const AUTHENTICATION_USER_DATA = 'userId';

const AUTHENTICATION_STATUS = "status";
const AUTHENTICATION_LOGIN_STATUS = "login_status"
const AUTHENTICATION_SERIAL_NUMBER = "serial_number"

const Storage = localStorage;

export default {

  async get() {
    // const result = await Storage.getItem(AUTHENTICATION_USER_DATA);

    
    const result = await Storage.getItem(AUTHENTICATION_USER_DATA);
    const result1 = await Storage.getItem(AUTHENTICATION_STORAGE_KEY)
    let finalResult={
      userId: result,
      token: result1
    }
    return finalResult;
    
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


  },
  setAuth(data) {
    Storage.setItem(AUTHENTICATION_STATUS, data.status);
    Storage.setItem(AUTHENTICATION_SERIAL_NUMBER, data.serial_number);
    Storage.setItem(AUTHENTICATION_USER_DATA, data.userId);
  },
  getAuth() {
    return {
      status: Storage.getItem(AUTHENTICATION_STATUS),
      login_status: Storage.getItem(AUTHENTICATION_LOGIN_STATUS)
    };
  }
};



// AsyncStorage.setItem(store_key, JSON.stringify(UID123_object), () => {
//   AsyncStorage.mergeItem('UID123', JSON.stringify(UID123_delta), () => {
//     AsyncStorage.getItem('UID123', (err, result) => {
//       console.log(result);
//     });
//   });
// });