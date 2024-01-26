import urls from '../urls';
import http from '../axios';

export function getAllVouchers(clientId = '') {
  return http.get(`${urls.getAllVouchers}${(clientId ? `?client_id=${clientId}` : '' )}`);
};

export function saveVoucher(data) {
    return http.post(urls.saveVoucher, data)
};

export function updateVoucher(data) {
  return http.put(`${urls.saveVoucher}`, data)
}

export function uploadVouchers(data, clientId, expiryDate) {
    const queryParams = `?client_id=${clientId}&expiry_date=${expiryDate}`
    
    return http.post(`${urls.uploadVouchers}${queryParams}`, data)
}

export function deleteVoucher(queryParam) {
  return http.delete(`${urls.deleteVoucher}${queryParam}`)
}

export default {
    getAllVouchers,
    saveVoucher
};