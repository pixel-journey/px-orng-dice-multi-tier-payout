# Under/over dice with bank solvency lock

> **Domain:** WAX ORNG — dice payout  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** `px-contract-examples-vault` (private index; not this public course)  
> **Path:** `px-contract-examples-vault` (private index; not this public course)

**Goal:** Under/over threshold (2..98), rejection-sampled roll 1..100, 200 bps house edge, bank **reserves the extra before the bet is accepted**.

**Code under test:** `npm test`. Entropy is a teaching input after oracle resolve — no live `orng.wax`.

**Official:** [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng).

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | Chance, edge, reject, bank |
| [TIPS.md](TIPS.md) | Reserve before accept |
| [SECURITY.md](SECURITY.md) | Solvency and once-only |
| [SOURCES.md](SOURCES.md) | Official + related |

## What is true (executed)

| Rule | Result |
| --- | --- |
| under/over 50 chance | 49 / 50 |
| 10000 at 50% | pays 19600 |
| byte 0..199 / 200..255 | roll / reject |
| place without bank extra | refused |
| second deliver | refused |

```bash
npm test
```

MIT — Pixel Journey
