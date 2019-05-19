/* globals localStorage */

const AUTHENTICATION_STORAGE_KEY = 'MCallAuthorization';
const AUTHENTICATION_USER_DATA = 'UserId';
const Storage = localStorage;

export default {
  get() {
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
  }
};
