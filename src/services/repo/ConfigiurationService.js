import urls from '../urls';
import http from '../axios';

export function getById(id) {
  return http.get(`${urls.configurations}/${id}/`)
}

export default {
  getById,
};