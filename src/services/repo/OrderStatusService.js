import urls from '../urls';
import http from '../axios';

export function get() {
  return http.get(urls.orderStatus);
}

export function create(data) {
  return http.post(`${urls.orderStatus}/`,data);
}


export function getByOrder(id,status) {
  return http.get(`${urls.orderStatus}/?order=${id}&status=${status}`);
}
export function update(data) {
  return http.put(urls.orderStatus, data);
}

export default {
  get,
  update,
  getByOrder,
  create
};