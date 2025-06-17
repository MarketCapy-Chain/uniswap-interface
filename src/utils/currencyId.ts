import { Currency, ETHER, Token } from '@nexuslayer/sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'CAPY'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
