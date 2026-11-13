# Under/over dice with bank solvency lock

> **Domain:** WAX ORNG — dice payout  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)  
> **Path:** [ORNG-LEARNING-PATH.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md)

**Goal:** Configurable under/over threshold (2..98), rejection-sampled roll 1..100, 200 bps house edge, and a bank that must **reserve the extra before the bet is accepted**.

**Code under test:** `npm test`. Does not call `orng.wax` or produce wasm. Entropy is a teaching input after a resolved oracle job (see the dual-callback and v3 starter labs).

**Official RNG:** [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng). **Sample:** [RNG tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample).

## What is true (executed)

| Rule | Result |
| --- | --- |
| under 50 chance | 49 |
| over 50 chance | 50 |
| 10000 at 50% chance | pays 19600 (2% edge) |
| byte 0..199 | roll 1..100 |
| byte 200..255 | reject (no settle) |
| place without bank for extra | refused |
| win | pays from reserve |
| loss | stake + reserve return to bank |
| second deliver | refused |

```bash
npm test
```

MIT — Pixel Journey
