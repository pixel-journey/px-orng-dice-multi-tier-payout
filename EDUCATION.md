# Education — under/over dice with house edge and bank reserve

> **Rung:** `npm test` passes. Entropy is a teaching **argument** after oracle resolve. No `requestrand` is sent.  
> **The test is the rule.**

Infra first: [v3 starter](https://github.com/pixel-journey/px-orng-v3-randnotify-starter) → [dual-callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent). Sibling money books: [coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow), [roulette](https://github.com/pixel-journey/px-orng-roulette-wheel-escrow).

Official: [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) · [RNG tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample).

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | Map under/over threshold to integer chance |
| Intermediate | 200 bps edge payout + byte rejection |
| Masterclass | Reserve **extra** before place; reject does not settle |

---

## Beginner — chance table

Faces are **1..100**. Threshold must be **2..98**.

| Side | Threshold | Chance |
| --- | --- | --- |
| under | 50 | **49** (rolls 1..49) |
| over | 50 | **50** (rolls 51..100) |
| over | 2 | 98 |
| under | 1 | bad threshold |
| over | 99 | bad threshold |

**Common mistake:** treating under-50 as 50% chance. The tests lock **49**.

---

## Intermediate — roll and payout

### Byte → face

| Byte | Roll |
| --- | --- |
| 0 | 1 |
| 99 | 100 |
| 100 | 1 |
| 199 | 100 |
| 200..255 | **reject** |

Rejected samples must **not** move escrow (test throws before settle).

### Edge

`EDGE_BPS = 200`. For stake S and chance C:

```text
payout = floor(S * 100 * (10000 - 200) / (C * 10000))
```

Example: S=10000, C=50 → **19600**. Do **not** reuse 19600 for under-50 (chance 49).

---

## Masterclass — bank reserve

Before `place`, bank must hold `payout - stake` (the **extra**). On place, extra moves to `reserved` and stake to `escrow`.

| Outcome | Books |
| --- | --- |
| Win | Player field gets payout; escrow+reserved clear |
| Loss | Stake+extra return to bank |
| Reject | Status rerequest / throw; money stays |
| Second deliver | already resolved |

### Attack → test angles

| Attack | Lab behavior |
| --- | --- |
| Accept bet bank cannot cover | `bank` refused |
| Settle reject sample | throw; open bet remains |
| Share one extra across two max bets | second place fails |
| Zero stake | refused |

### Nice-to-have product extensions (not in this repo)

- Multi-tier ladders (exact face bonuses) — new chance table + tests.  
- Live dual-callback binding of entropy.  
- Token payout in same action as book clear.  
- Credit/stake gates before place — [credit bucket](https://github.com/pixel-journey/px-orng-credit-bucket-monitor).

Numbers: [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md).

### Exercises

1. winChance under 50? (49)  
2. Byte 200 — settle or reject?  
3. Why reserve at place not deliver?
