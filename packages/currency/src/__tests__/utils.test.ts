import { describe, it, expect } from 'vitest'
import { validateAndParseEVMAddress, parseAmount } from '../utils'
import { Address } from 'viem'

describe('validateAndParseEVMAddress', () => {
  it('should validate and return formatted address', () => {
    const address = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
    const result = validateAndParseEVMAddress(address)
    expect(result).toBe('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address)
  })

  it('should throw error for invalid address', () => {
    const invalidAddress = '0xinvalid'
    expect(() => validateAndParseEVMAddress(invalidAddress)).toThrow()
  })
})

describe('parseAmount', () => {
  it('should parse integers correctly', () => {
    expect(parseAmount('100').toString()).toBe('100000000000000000000')
    expect(parseAmount('0').toString()).toBe('0')
  })

  it('should parse decimals correctly', () => {
    expect(parseAmount('1.5').toString()).toBe('1500000000000000000')
    expect(parseAmount('0.1').toString()).toBe('100000000000000000')
  })

  it('should support custom decimals', () => {
    expect(parseAmount('1.23', 6).toString()).toBe('1230000')
    expect(parseAmount('0.1', 8).toString()).toBe('10000000')
  })

  it('should handle long decimals', () => {
    expect(parseAmount('1.123456789123456789').toString()).toBe('1123456789123456789')
    expect(parseAmount('1.12345678912345678912').toString()).toBe('1123456789123456789')
  })
})
