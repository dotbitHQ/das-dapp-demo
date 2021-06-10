import { BasicService } from '~/services/BasicService'

export interface IErLockScript {
  code_hash: string
  hash_type: string
  args: string
}

export interface IRecord {
  key: string
  type: string
  label: string
  value: string
  ttl: string
}

export interface IOutPoint {
  tx_hash: string
  index: number
}

export interface IAccountData {
  account: string
  account_id_hex: string
  next_account_id_hex: string
  create_at_unix: number
  expired_at_unix: number
  status: number
  owner_lock_script: IErLockScript
  manager_lock_script: IErLockScript
  records: IRecord[]
}

export interface ISearchAccount {
  out_point: IOutPoint
  account_data: IAccountData
}

export default class Services extends BasicService {
  /**
   * search account
   * @param account
   */
  searchAccount (account: string): Promise<ISearchAccount> {
    return this.rpc('das_searchAccount', account)
  }

  sendTrx (trx: any) {
    return this.axios.post('/api/rpc_relay', {
      jsonrpc: this.jsonrpc,
      id: ++this.id,
      method: 'send_transaction',
      params: [trx]
    }, {
      baseURL: 'https://test-ckb.abcwallet.com'
    })
  }
}
