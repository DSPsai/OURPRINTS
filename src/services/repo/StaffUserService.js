import urls from '../urls';
import http from '../axios';

export function get() {
  return http.get(urls.staffUsers);
}
export function create(data) {
  return http.post(`${urls.staffUsers}/`, data)
}

export function update(data) {
  return http.put(`${urls.staffUsers}${data.id}/`, data)
}
export function getById(id) {
  return http.get(`${urls.staffUsers}${id}/`)
}
export function deleteById(id) {
  return http.delete(`${urls.staffUsers}${id}/`)
}
export function getDashboardView(id) {
  return http.get(`${urls.staffUsersDashboard}?staff_id=${id}`)
}
export function getDashboard(data) {
  return http.get(`${urls.staffUsersDashboard}?from_date=${data.from_date}&to_date=${data.to_date}&staff_id=${data.staff_id}`)
}
export default {
  get,
  create,
  update,
  getById,
  getDashboard,
  getDashboardView,
  deleteById

};