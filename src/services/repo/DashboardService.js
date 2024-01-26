import urls from '../urls';
import http from '../axios';

export function get() {
  return http.get(`${urls.dashboard}/`)
}
export function getDate(data) {
  return http.get(`${urls.dashboard}/?from_date=${data.from_date}&to_date=${data.to_date}`)
}

export default {
  get,
  getDate
};