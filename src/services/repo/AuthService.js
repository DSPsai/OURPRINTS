import http from '../axios';
import urls from '../urls';

export function login(data) {
  return http.post(urls.adminLogin, data);
}

export default {
  login
}