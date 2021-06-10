import Decimal from 'decimal.js'
// @ts-ignore
import abcCopy from 'abc-copy'

/**
 * Used to determine whether it is a mobile terminal
 */
export function isMobile (): boolean {
  return window.innerWidth < 960
}

/**
 * Enhance the key of the module in vuex, because these modules have namespace, so the outside world must add namespace if they want to use it.
 * @param keys
 * @param namespace
 */
export function augmentKeys<T> (keys: T, namespace: string): T {
  const ret: any = {}
  for (const key in keys) {
    if (!Object.prototype.hasOwnProperty.call(keys, key)) {
      continue
    }

    if (key === 'namespace') {
      ret[key] = keys[key]
    }
    else {
      ret[key] = `${namespace}/${keys[key]}`
    }
  }
  return ret
}

/**
 * Add zeros to the front of numbers less than 10
 * @param num
 */
export function replenishZero (num: number): string {
  if (Number(num) < 10) {
    return `0${num}`
  }
  return `${num}`
}

/**
 * shrinkUnit
 * @param value
 * @param shrinkDecimals
 * @param precision
 */
export function shrinkUnit (value: string|number|Decimal, shrinkDecimals: number, precision = 8): string {
  value = value || 0
  const decimalNum = Decimal.div(value, 10 ** shrinkDecimals)
  let decimals = decimalNum.decimalPlaces()

  if (decimals > precision) {
    decimals = precision
  }
  return decimalNum.toFixed(decimals, Decimal.ROUND_DOWN)
}

/**
 * expandUnit
 * @param value
 * @param decimals
 * @param precision
 */
export function expandUnit (value: string|number|Decimal, decimals: number, precision = 0): string {
  value = value || 0
  return Decimal.mul(value, 10 ** decimals).toFixed(precision, Decimal.ROUND_DOWN)
}

/**
 * Thousands of divisions
 * @param num
 * @param digits
 */
export function thousandSplit (num: number | string | Decimal, digits?: number): string {
  if (digits && digits > 0) {
    if (Decimal.isDecimal(num)) {
      num = (num as Decimal).toFixed(digits).toString()
    }
    else {
      num = new Decimal(num).toFixed(digits).toString()
    }
  }
  const strNum = num + ''
  if (strNum.includes('.')) {
    return (num + '').replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  }
  else {
    return strNum.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  }
}

/**
 * Copy data to the clipboard
 * @param text
 * @param el
 */
export function copyText (text: string, el?: Element): Promise<void> {
  return abcCopy(text, {
    target: el
  })
}

/**
 * String reduction
 * @param inputString
 * @param head
 * @param tail
 * @param tokenStr
 */
export function collapseString (inputString = '', head = 4, tail = 4, tokenStr = '...'): string {
  if (inputString.length > 12) {
    return inputString.slice(0, head) + tokenStr + inputString.slice(-tail)
  }
  else {
    return inputString
  }
}

/**
 * load script
 * @param src
 * @param id
 */
export function loadScript (src: string, id: string): Promise<any> {
  const script = 'script'
  const firstScript: HTMLScriptElement = document.getElementsByTagName(script)[0]
  if (document.getElementById(id)) {
    return Promise.resolve()
  }
  const scriptElement: HTMLScriptElement = document.createElement(script)
  scriptElement.id = id
  scriptElement.src = src
  firstScript.parentNode?.insertBefore(scriptElement, firstScript)

  return new Promise((resolve, reject) => {
    scriptElement.onload = resolve
    scriptElement.onerror = reject
  })
}

/**
 * 获取当前平台以及应用信息
 */
export function getAllUserAgent () {
  const ua: string = window.navigator.userAgent.toLowerCase()
  const wechat = ua.includes('micromessenger')
  return {
    // 应用UA
    wechat, // 微信
    weibo: ua.includes('weibo'), // 微博
    abcwallet: ua.includes('abcwallet'), // ABCWallet
    // 平台UA
    android: ua.includes('android'),
    ios: ua.includes('iphone') || ua.includes('ipad'),
    windows: ua.includes('windows'),
    ubuntu: ua.includes('ubuntu'),
    mac: ua.includes('mac'),
    messenger: !wechat && (
      ua.includes('messenger') ||
      ua.includes('fbav') ||
      ua.includes('fban') ||
      window.location.href.includes('fb_iframe_origin') // 在 web 版 messenger 的 iframe 里面
    )
  }
}

/**
 * 检测是否支持给定的 ua
 * @param uaList
 */
export function isUASupported (uaList: string[]): boolean {
  const uaMap = getAllUserAgent()
  return uaList.some(ua => (uaMap as any)[ua])
}

/**
 * 检查当前访问环境是否是 ABCWallet iOS、Android 环境
 */
export function isABCWallet (): boolean {
  return isUASupported(['abcwallet'])
}
