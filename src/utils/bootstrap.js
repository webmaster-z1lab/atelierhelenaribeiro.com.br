import axios from 'axios'
import {localStorage} from "@/utils/storage";

let api_token = localStorage().getItem('api_token');

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Accept'] = 'application/json'

if (api_token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${api_token}`
}

export const HTTP = axios.create()
