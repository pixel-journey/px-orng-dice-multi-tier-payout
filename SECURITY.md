# Security — under/over dice

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Bad threshold / zero stake | refused |
| Bank cannot reserve the extra | refused at **place** |
| Bytes 200..255 | **reject**; no settle |
| Missing / duplicate bet id | refused |
| Second deliver | already resolved |
| Bad entropy shape | refused |
| Under-50 treated as 50% | tests lock chance **49** |

## Authorization (production still needs)

| Concern | Guidance |
| --- | --- |
| Oracle | `require_auth(orng.wax)` |
| Player | `require_auth` on place |
| Global solvency | Sum of open max liabilities ≤ bank |
| Credits | Before place |
| Token custody | Escrow in, payout out, same tx preferred |

## Attack angles

1. Off-by-one on the threshold (including the pivot incorrectly).
2. Settling a rejected sample as a loss.
3. Reusing coinflip’s 254–255 reject window (dice uses 200–255).
4. Accepting a bet whose max payout the bank cannot cover.

## Honesty limits

Entropy is a teaching argument after a simulated resolve. No `requestrand` is sent. No live token transfers.

Related: [coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow) · [roulette](https://github.com/pixel-journey/px-orng-roulette-wheel-escrow) · [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng)
