import { describe, it, expect } from 'vitest'
import { CurrencyAmount } from '../currencyAmount'
import { Currency } from '../currency'
import BigNumber from 'bignumber.js'

describe('CurrencyAmount', () => {
  const token = new Currency(
    1, // chainId
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // address
    18, // decimals
    'TEST', // symbol
    'Test Token' // name
  )

  describe('constructor', () => {
    it('should create instance with valid positive integer amounts', () => {
      const amount1 = new CurrencyAmount(token, '100')
      const amount2 = new CurrencyAmount(token, 100)
      const amount3 = new CurrencyAmount(token, new BigNumber(100))

      expect(amount1.raw.toString()).toBe('100')
      expect(amount2.raw.toString()).toBe('100')
      expect(amount3.raw.toString()).toBe('100')
    })

    it('should throw error for non-integer amounts', () => {
      expect(() => new CurrencyAmount(token, '100.5')).toThrow('Amount must be a positive integer')
      expect(() => new CurrencyAmount(token, -100)).toThrow('Amount must be a positive integer')
    })
  })

  describe('arithmetic operations', () => {
    describe('add', () => {
      it('should add two currency amounts correctly', () => {
        const amount1 = new CurrencyAmount(token, '100')
        const amount2 = new CurrencyAmount(token, '200')
        const result = amount1.add(amount2)
        expect(result.raw.toString()).toBe('300')
      })

      it('should throw error when adding different currencies', () => {
        const token2 = new Currency(1, '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', 18, 'TEST2', 'Test Token 2')
        const amount1 = new CurrencyAmount(token, '100')
        const amount2 = new CurrencyAmount(token2, '200')
        expect(() => amount1.add(amount2)).toThrow('TOKEN')
      })
    })

    describe('subtract', () => {
      it('should subtract two currency amounts correctly', () => {
        const amount1 = new CurrencyAmount(token, '200')
        const amount2 = new CurrencyAmount(token, '100')
        const result = amount1.subtract(amount2)
        expect(result.raw.toString()).toBe('100')
      })

      it('should throw error when result is negative', () => {
        const amount1 = new CurrencyAmount(token, '100')
        const amount2 = new CurrencyAmount(token, '200')
        expect(() => amount1.subtract(amount2)).toThrow('The result is negative')
      })

      it('should throw error when subtracting different currencies', () => {
        const token2 = new Currency(1, '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', 18, 'TEST2', 'Test Token 2')
        const amount1 = new CurrencyAmount(token, '200')
        const amount2 = new CurrencyAmount(token2, '100')
        expect(() => amount1.subtract(amount2)).toThrow('TOKEN')
      })
    })

    describe('multiply', () => {
      const amount = new CurrencyAmount(token, '100')

      it('should multiply with various input types', () => {
        expect(amount.multiply('2').raw.toString()).toBe('200')
        expect(amount.multiply(2).raw.toString()).toBe('200')
        expect(amount.multiply(new BigNumber(2)).raw.toString()).toBe('200')
        expect(amount.multiply(new CurrencyAmount(token, '2')).raw.toString()).toBe('200')
      })

      it('should round down decimal results', () => {
        expect(amount.multiply('1.5').raw.toString()).toBe('150')
        expect(amount.multiply('1.99').raw.toString()).toBe('199')
      })
    })

    describe('divide', () => {
      const amount = new CurrencyAmount(token, '100')

      it('should divide with various input types', () => {
        expect(amount.divide('2').raw.toString()).toBe('50')
        expect(amount.divide(2).raw.toString()).toBe('50')
        expect(amount.divide(new BigNumber(2)).raw.toString()).toBe('50')
        expect(amount.divide(new CurrencyAmount(token, '2')).raw.toString()).toBe('50')
      })

      it('should throw error when dividing by zero', () => {
        expect(() => amount.divide('0')).toThrow('The division cannot be zero')
        expect(() => amount.divide(0)).toThrow('The division cannot be zero')
        expect(() => amount.divide(new BigNumber(0))).toThrow('The division cannot be zero')
        expect(() => amount.divide(new CurrencyAmount(token, '0'))).toThrow('The division cannot be zero')
      })

      it('should round down decimal results', () => {
        expect(amount.divide('3').raw.toString()).toBe('33')
      })
    })
  })

  describe('formatting methods', () => {
    const amount = new CurrencyAmount(token, '123456789')
    const amount1 = new CurrencyAmount(token, '11111111238567894543251102')
    const amount2 = new CurrencyAmount(token, '11108567894543251102')
    const amount3 = new CurrencyAmount(token, '11018567894543251102')

    describe('toFormat methods', () => {
      it('should format with default options', () => {
        expect(amount.toFormat()).toBe('0')
        expect(amount2.toFormat(2)).toBe('11.1')
        expect(amount3.toFormat(2)).toBe('11.01')
        expect(amount2.toFormat(3)).toBe('11.108')
        expect(amount1.toFormat()).toBe('11,111,111.23')
      })

      it('should respect significant digits', () => {
        expect(amount.toFormat(18)).toBe('0.000000000123456789')
        expect(amount.toFormat(16)).toBe('0.0000000001234567')
        expect(amount1.toFormat(3)).toBe('11,111,111.238')
      })

      it('should handle minimum threshold', () => {
        expect(amount.toFormat(3, 10)).toBe('<10')
        expect(amount1.toFormat(3, 10)).toBe('11,111,111.238')
      })
    })

    describe('toFixed', () => {
      it('should format with default decimals', () => {
        expect(amount.toFixed()).toBe('0')
        expect(amount1.toFixed()).toBe('11111111')
      })

      it('should respect decimal places', () => {
        expect(amount.toFixed(2)).toBe('0.00')
        expect(amount1.toFixed(2)).toBe('11111111.23')
      })

      it('should throw error for invalid decimal places', () => {
        expect(() => amount.toFixed(19)).toThrow('DECIMALS')
      })
    })

    describe('toExact', () => {
      it('should format without group separator', () => {
        expect(amount.toExact()).toBe('0.000000000123456789')
        expect(amount1.toExact()).toBe('11111111.238567894543251102')
      })
    })
  })

  describe('static factory methods', () => {
    describe('fromRawAmount', () => {
      it('should create instance from raw amount', () => {
        const amount = CurrencyAmount.fromRawAmount(token, '100')
        expect(amount.raw.toString()).toBe('100')
      })
    })

    describe('fromAmount', () => {
      it('should create instance from decimal amount', () => {
        const amount = CurrencyAmount.fromAmount(token, '1.5')
        expect(amount?.raw.toString()).toBe('1500000000000000000')
      })

      it('should handle invalid amounts', () => {
        expect(CurrencyAmount.fromAmount(token, 'invalid')).toBeUndefined()
        expect(CurrencyAmount.fromAmount(token, '')?.toExact()).toBe('0')
      })

      it('should handle zero amount', () => {
        const amount = CurrencyAmount.fromAmount(token, '0')
        expect(amount?.raw.toString()).toBe('0')
      })
    })
  })
})
