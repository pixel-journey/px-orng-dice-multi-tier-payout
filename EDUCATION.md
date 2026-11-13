# Education — under/over dice

> **Rung:** `npm test` passes. Entropy is a teaching input after oracle resolve.  
> Infra first: [v3](https://github.com/pixel-journey/px-orng-v3-randnotify-starter) → [dual-callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent).

## What you should be able to do

| Level | Skill |
| --- | --- |
| Beginner | under/over threshold → win chance |
| Intermediate | 200 bps edge payout + rejection sampling |
| Masterclass | Reserve **extra** before accepting the bet |

## Beginner

- `under 50` → chance 49 (faces 1..49)
- `over 50` → chance 50 (faces 51..100)
- Threshold must be 2..98

## Intermediate

Roll from byte0: values `0..199` map to faces `1..100` via `(byte % 100) + 1`. Values `200..255` **reject** (request new entropy; do not settle).

Payout for stake S at chance C:  
`S * 100 * (10000 - 200) / (C * 10000)` → e.g. 10000 at 50% → **19600**.

## Masterclass

Before `place`, bank must hold `payout - stake`. That **extra** moves to `reserved`. On win, player gets payout from escrow+reserve accounting; on loss, stake+extra return to bank. Second `deliver` refused.

## Will not teach

Live orng.wax calls or that rejection rates are free on mainnet (credits matter).
