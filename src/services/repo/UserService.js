import urls from '../urls';
import http from '../axios';

export function get() {
  return http.get(urls.users);
}
export function create(data) {
  return http.post(urls.users, data)
}
export function staffUserCreate(data) {
  return http.post(urls.staffUsersCreate, data)
}

export function getById(id) {
  return http.get(`${urls.users}${id}/`)
}
export function updatePassword(data) {
  return http.post(urls.updatePassword, data);
}

export function getUserCoinInfo(id) {
  return http.get(`${urls.userCoinInfo}?user_id=${id}`)
}
export default {
  get,
  create,
  getById,
  updatePassword,
  staffUserCreate,
  getUserCoinInfo
};