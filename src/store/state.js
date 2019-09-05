import {ls} from "@/services";

export default {
  loading: false,
  user: ls.get('user') || {},
  api_token: ls.get('api-token') || ''
}
