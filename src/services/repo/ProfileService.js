import urls from '../urls';
import http from '../axios';

export function get() {
  return http.get(urls.user);
}

export function update(data) {
  return http.put(urls.user, data);
}

export default {
  get,
  update,
};