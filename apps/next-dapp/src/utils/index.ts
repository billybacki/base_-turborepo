import { getAddress } from '@ethersproject/address'

export function isBrowser() {
  return typeof window === 'object'
}

export function getCurrentTimeStamp(date?: Date | string | number) {
  return Number(((date ? new Date(date) : new Date()).getTime() / 1000).toFixed())
}

export default function isZero(hexNumberString: string) {
  return /^0x0*$/.test(hexNumberString)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export function shortenHash(hash: string, suffixLength = 6): string {
  if (typeof hash !== 'string' || hash.length <= 4 + suffixLength) {
    return hash // Return original hash if it's not a string or shorter than prefix + suffix length
  }

  const prefix = hash.slice(0, 4)
  const suffix = hash.slice(-suffixLength)
  return `${prefix}...${suffix}`
}

export function isURL(url: string) {
  const strRegex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&amp;:/~+#]*[\w\-@?^=%&amp;/~+#])?/
  const re = new RegExp(strRegex)
  return re.test(url)
}

export function isEmail(value: string): boolean {
  return /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{1,8}(,[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{1,8})*$/.test(
    value
  )
}
