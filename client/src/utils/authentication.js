/* globals localStorage */

const AUTHENTICATION_STORAGE_KEY = 'MCallAuthorization';
const Storage = localStorage;

export default {
  get() {
    return Storage.getItem(AUTHENTICATION_STORAGE_KEY);
  },
  set(token) {
    return Storage.setItem(AUTHENTICATION_STORAGE_KEY, token);
  },
  clear() {
    return Storage.removeItem(AUTHENTICATION_STORAGE_KEY);
  }
};
