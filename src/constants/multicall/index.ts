import { ChainId } from '@nexuslayer/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.CAPY]: '0x4233D3072916e557054a285bae033f6eC046050b'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
