# Basic Repository Restructuring Plan

Building a monorepo where web3-related, token-related, and UI-related components exist as separate packages for easier maintenance and usage.

## Main Directions

- Using `pnpm` as package manager
- Using `typescript` as programming language
- Using `Turborepo` as infrastructure
- Using `react` as view framework
- Compatible with web frameworks like `nextjs` and `vite+react`

## Major Changes

- Replacing `ethers` with `viem` for web3 implementation
- Using `wagmi` as the wallet integration library, UI library not restricted
- Abandoning current multicall implementation, rewriting basic hooks
- Continuing to use `mui` for UI components, maintaining unified theme customization, removing and rewriting custom components
