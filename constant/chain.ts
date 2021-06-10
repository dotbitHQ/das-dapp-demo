export enum CHAIN_ID {
  ckb,
  eth,
  btc,
  tron
}

export enum LOCK_SCRIPT_TYPE {
  ckb,
  none,
  eth,
  btc,
  tron
}

export interface IMainChain {
  name: string
  symbol: string
  chainId: CHAIN_ID
  decimals: number
  icon: string
  tokenId: string
  lockScriptType: LOCK_SCRIPT_TYPE
  explorerAddress: string
  tag?: string
  logo?: string
}

export const CKB: IMainChain = {
  name: 'Nervos Network',
  symbol: 'CKB',
  chainId: CHAIN_ID.ckb,
  decimals: 8,
  icon: 'nervos-network',
  tokenId: 'ckb_ckb',
  lockScriptType: LOCK_SCRIPT_TYPE.ckb,
  explorerAddress: 'https://explorer.nervos.org/address/'
}

export const ETH: IMainChain = {
  name: 'Ethereum',
  symbol: 'ETH',
  chainId: CHAIN_ID.eth,
  decimals: 18,
  icon: 'ethereum',
  tokenId: 'eth_eth',
  lockScriptType: LOCK_SCRIPT_TYPE.eth,
  explorerAddress: 'https://etherscan.io/address/'
}

export const TRON: IMainChain = {
  name: 'TRON',
  symbol: 'TRX',
  chainId: CHAIN_ID.tron,
  decimals: 6,
  icon: 'tron',
  tokenId: 'tron_trx',
  lockScriptType: LOCK_SCRIPT_TYPE.tron,
  explorerAddress: 'https://tronscan.org/#/address/'
}

export const BTC: IMainChain = {
  name: 'Bitcoin',
  symbol: 'BTC',
  chainId: CHAIN_ID.btc,
  decimals: 8,
  icon: 'bitcoin',
  tokenId: 'btc_btc',
  lockScriptType: LOCK_SCRIPT_TYPE.btc,
  explorerAddress: 'https://explorer.btc.com/btc/address/'
}

export const CHAINID_TO_CHAIN = {
  [CHAIN_ID.eth]: ETH,
  [CHAIN_ID.ckb]: CKB,
  [CHAIN_ID.tron]: TRON,
  [CHAIN_ID.btc]: BTC
}
