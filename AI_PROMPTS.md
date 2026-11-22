# AI handoff — multi-tier dice payout

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

| Source | Role |
| --- | --- |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | Entropy delivery |
| [coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow) | Different reject window / payout |
| [roulette](https://github.com/pixel-journey/px-orng-roulette-wheel-escrow) | 0–36; reject 222–255 |
| [ORNG-LEARNING-PATH](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md) | Game books |

## Non-negotiables

1. Under-50 uses chance **49**, not 50 — fair payout is **not** coinflip's 19600.
2. Reject / rerequest range **200–255** (dice only).
3. Bank reserve is checked at **place**.
4. Do not merge coinflip reject **254–255** or roulette **222–255** into this book.
5. Oracle auth is not checked here. No broadcast.
6. Payout math ports; `orng.wax` delivery is WAX-only.

## Prompt seeds

- "Why is under-50 chance 49, not 50?"
- "Byte 200 arrives — reject or settle?"
- "Contrast reject windows: coinflip vs dice vs roulette."
- "Show bank reserve refusal at place, not at resolve."

## Do not

- Use coinflip 19600 for under-50 dice.
- Settle a rejected byte as a low residue.
- Claim live orng auth from this pure book.
