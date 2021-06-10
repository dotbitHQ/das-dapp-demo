import Axios, { AxiosInstance } from 'axios'
import { onFulfilled, onRejected } from './interceptors'
import { servicesApi, isProd } from '~/config'

export class BasicService {
  id = 0
  jsonrpc = '2.0'
  axios: AxiosInstance

  constructor () {
    this.axios = Axios.create({
      baseURL: servicesApi,
      withCredentials: true
    })
    this.axios.interceptors.response.use(onFulfilled, onRejected)
  }

  /**
   * rpc request method
   * @param method
   * @param params
   */
  rpc (method: string, params: any): Promise<any> {
    const _path = isProd ? '' : `/${method}`
    return this.axios.post(_path, {
      jsonrpc: this.jsonrpc,
      id: ++this.id,
      method,
      params: [params]
    })
  }
}
