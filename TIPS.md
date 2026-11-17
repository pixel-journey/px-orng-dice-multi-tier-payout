# Tips — under/over dice with house edge

## Fairness

- Under 50 is **49** chances (rolls 1..49), not 50. The test locks `winChance("under", 50) === 49`.
- Bytes **200..255** are rerequest. Different window from coinflip (254..255) and roulette (222..255).
- Rejection sampling must run **before** settle. A rejected sample must not move escrow.

## Payout math

- `19600` is the payout for **chance 50** and stake `10000` after a **200 bps** edge. Do not reuse it for under-50 (chance 49).
- Formula shape: scale stake by fair odds, then apply the edge. Document the exact integer formula next to the tests.

## Solvency

- Reserve `payout - stake` at **place**, not at deliver.
- A win the bank cannot cover must never be accepted.

## Common mistakes

1. Off-by-one on the threshold (including or excluding the pivot).
2. Copying coinflip's reject window into dice.
3. Settling on a rejected sample and calling it a house win.
4. Computing payout with floating point and rounding at the end.

## Nice-to-have extensions (not in this repo)

| Idea | Note |
| --- | --- |
| Multi-threshold ladder | New tests per band |
| Hard max bet | From bank extra / max payout ratio |
| Credits gate | [credit bucket](https://github.com/pixel-journey/px-orng-credit-bucket-monitor) |

Related: [coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow) · [roulette](https://github.com/pixel-journey/px-orng-roulette-wheel-escrow) · [byte-slicer](https://github.com/pixel-journey/px-orng-byte-slicer-multi-roll) · [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng)
