import { useAddress, useSDK } from '@thirdweb-dev/react'
import { useMemo } from 'react'

export function useThirdwebWeb3() {
  const address = useAddress()
  const sdk = useSDK()

  return useMemo(() => ({
    account: address || null,
    active: !!address,
    library: sdk?.getProvider(),
    chainId: 586 // Capy chain ID
  }), [address, sdk])
}