import axios from 'axios';
import cfg from '../cfg';

const defaultHeaders = {
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('token') || ''
};

export const httpForm = axios.create({
  baseURL: `${cfg.baseURL}`,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: localStorage.getItem('token') || ''
  }
});

export default axios.create({
  baseURL: `${cfg.baseURL}`,
  headers: defaultHeaders
});
