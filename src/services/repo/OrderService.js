import urls from '../urls';
import http from '../axios';

export function getCompleted() {
  return http.get(`${urls.orders}/?status=delivered`);
}
export function getCompletedDate(data) {
  return http.get(`${urls.orders}/?status=delivered&from_date=${data.from_date}&to_date=${data.to_date}`);
}
export function getPendingDate(data) {
  return http.get(`${urls.orders}/?status=confirmed&from_date=${data.from_date}&to_date=${data.to_date}`);
}
export function getAssignedDate(data) {
  return http.get(`${urls.orders}/?status_exclude=assigned&from_date=${data.from_date}&to_date=${data.to_date}`);
}
export function get() {
  return http.get(`${urls.orders}/`);
}

export function getPending() {
  return http.get(`${urls.orders}/?status=confirmed`);
}

export function getAssigned() {
  return http.get(`${urls.orders}/?status_exclude=assigned`);
}
export function getTotal() {
  return http.get(`${urls.orders}/`);
}
export function getById(id) {
  return http.get(`${urls.orders}/${id}/`)
}

export function update(data) {
  return http.patch(`${urls.orders}/${data.id}/`, data)
}

export function getMyCompleted(id) {
  return http.get(`${urls.myOrders}/?assigned_user=${id}&status=delivered`);
}
export function getMyCompletedDate(data) {
  return http.get(`${urls.myOrders}/?assigned_user=${data.id}&status=delivered&from_date=${data.from_date}&to_date=${data.to_date}`);
}
export function getMyPending(id) {
  return http.get(`${urls.myOrders}/?assigned_user=${id}&exclude_status=delivered`);
}
export function getMyOutForDelivery(id) {
  return http.get(`${urls.myOrders}/?assigned_user=${id}&status=out-for-delivery`);
}
export function getMyOutForDeliveryDate(data) {
  return http.get(`${urls.myOrders}/?assigned_user=${data.id}&status=out-for-delivery&from_date=${data.from_date}&to_date=${data.to_date}`);
}
export function getMyPendingDate(data) {
  return http.get(`${urls.myOrders}/?assigned_user=${data.id}&exclude_status=delivered&from_date=${data.from_date}&to_date=${data.to_date}`);
}


export default {
  get,
  getCompleted,
  update,
  getById,
  getPending,
  getTotal,
  getMyCompleted,
  getMyPending,
  getCompletedDate,
  getPendingDate,
  getMyPendingDate,
  getMyOutForDelivery,
  getAssigned,
  getAssignedDate,
  getMyCompletedDate,
  getMyOutForDeliveryDate
};