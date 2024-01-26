import urls from '../urls';
import http from '../axios';

export function get() {
  return http.get(urls.leads);
}


export default {
  get,
};