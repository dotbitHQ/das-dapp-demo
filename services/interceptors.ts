import { AxiosError, AxiosResponse } from 'axios'
import errno from '~/constant/errno'

export function onFulfilled (res: AxiosResponse) {
  if (res.data && res.data.result) {
    if (res.data.result.errno === errno.success) {
      return res.data.result.data
    }
    else {
      const serverError: any = new Error(res.data.result.errmsg)
      serverError.code = res.data.result.errno
      throw serverError
    }
  }
  else if (res.data && res.data.error) {
    const serverError: any = new Error(res.data.error.message)
    serverError.code = res.data.error.code
    throw serverError
  }
}

export function onRejected (err: AxiosError) {
  const serverError: any = new Error((err.response as AxiosResponse).statusText)
  serverError.code = (err.response as AxiosResponse).status
  return Promise.reject(serverError)
}
