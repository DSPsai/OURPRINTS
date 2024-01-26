import urls from '../urls';
import http from '../axios';

export function getClients() {
  return http.get(urls.getClients);
}
export function saveClients(data) {
  return http.post(urls.saveClients, data)
};

export function updateClient(data, clientId) {
  return http.post(`${urls.updateClient}?client_id=${clientId}`, data)
}

export function deleteClients(queryParam) {
  return http.delete(`${urls.deleteClients}${queryParam}`)
}

export default {
    getClients,
    saveClients,
    updateClient,
    deleteClients
};