import urls from '../urls';
import http from '../axios';

export function getQrCodes() {
  return http.get(urls.getQrCodes);
}
export function saveQrCode(data) {
  return http.post(urls.saveQrCodes, data)
};

export function updateQrCode(data, id) {
  return http.post(`${urls.updateQrCode}?qr_id=${id}`, data)
};

export function deleteQrCodes(queryParam) {
  return http.delete(`${urls.deleteQrCodes}${queryParam}`)
}

export default {
    getQrCodes,
    saveQrCode,
    updateQrCode,
    deleteQrCodes
};