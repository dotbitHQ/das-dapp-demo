import { Context } from '@nuxt/types'
import { extend, setInteractionMode } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import Decimal from 'decimal.js'
import { BTC, CHAINID_TO_CHAIN, CKB, ETH, TRON } from '~/constant/chain'
import { thousandSplit } from '~/modules/tools'

setInteractionMode('lazy')

export default function ({ app }: Context) {
  // field required
  extend('required', {
    ...required,
    message: (fieldName): string => {
      return <string>app.i18n.t(`请输入有效的${fieldName}`)
    }
  })

  // check address format
  extend('address', {
    params: ['chainId'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    message: (fieldName, args: any): string => {
      // @ts-ignore
      return <string>app.i18n.t(`${CHAINID_TO_CHAIN[args.chainId].symbol} 地址格式错误`)
    },
    validate (value: string, args: any): boolean {
      switch (Number(args.chainId)) {
        case BTC.chainId:
          return /^[13][a-km-zA-HJ-NP-Z1-9]{25,33}$/.test(value)
        case ETH.chainId:
          return /^0x[a-fA-F0-9]{40}$/.test(value)
        case TRON.chainId:
          return /^T[a-zA-Z0-9]{33}$/.test(value)
        case CKB.chainId:
          return /^(ckb1|ckt1)[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{42,91}$/i.test(value)
        default:
          return false
      }
    }
  })

  // maximum amount
  extend('maxAmount', {
    params: ['maxAmount'],
    validate (value: string, args: any) {
      return new Decimal(value).lte(args.maxAmount)
    },
    message: (fieldName, args: any): string => {
      return <string>app.i18n.t(`${fieldName}必须小于等于 ${thousandSplit(args.maxAmount)}`)
    }
  })

  // minimum amount
  extend('minAmount', {
    params: ['minAmount'],
    validate (value: string, args: any) {
      return new Decimal(value).gte(args.minAmount)
    },
    message: (fieldName, args: any): string => {
      return <string>app.i18n.t(`${fieldName}必须大于 ${thousandSplit(args.minAmount)}`)
    }
  })
}
