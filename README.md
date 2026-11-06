# px-orng-dice-multi-tier-payout

> **Trust:** private educational lab (Tier B)  
> **Quest:** 005 — under/over dice with solvency lock  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** Configurable under/over threshold (2..98), rejection-sampled roll 1..100, 200 bps house edge, bank must reserve the extra before the bet is accepted.

**Real code:** `npm test`. **Does not** call `orng.wax` or produce wasm.

## What is true

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

## Run

```bash
npm test
```

MIT — Pixel Journey
