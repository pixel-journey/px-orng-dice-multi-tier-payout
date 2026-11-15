# Worked examples — under/over dice

House edge is `EDGE_BPS` `200`. `winPayout(10000n, 50)` is `19600n` (stake times `10000/chance`, then the edge). Chance is an integer percent, not a float.

| Side | Threshold | Chance |
| --- | --- | --- |
| under | 50 | 49 |
| over | 50 | 50 |
| over | 2 | 98 |
| under | 1 | `bad threshold` |
| over | 99 | `bad threshold` |

Legal thresholds are `2..98`.

## Byte to a 1..100 roll

`rollFromByte` uses two residues of 100 inside a byte, then rejects the tail.

| Byte | Roll |
| --- | --- |
| `0` | 1 |
| `99` | 100 |
| `100` | 1 |
| `199` | 100 |
| `200` and `255` | `reject` |

## Win

Books start with bank `10000`. Alice stakes `10000`, under 50. The reserve is `winPayout(10000n, 49) - 10000n` (the extra the bank must already hold).

Entropy prefix `09` (then 31 bytes of `22`). First byte is 9, so the roll is `10`. She is paid `winPayout(10000n, 49)`. Escrow and reserved both end at `0`.

## Loss

Same bet. Prefix `63` (99 decimal). Payout is `0`. Bank becomes `20000`: the original `10000` plus her stake.

## Reject does not settle

Bank `20000`, Bob stakes `100`, over 50. Prefix `c8` is byte 200. `deliver` throws `reject sample`. The bet stays open.

## Other refusals

| Case | Error |
| --- | --- |
| Bank `0`, stake `10000`, under 50 | bank (cannot reserve the extra) |
| Stake `0` | bad stake |
| `deliver` id `9` when the bet id is `1` | missing bet |
| Second `deliver` on the same id | already resolved |
| Second `place` with id `1` | duplicate id |
| Entropy `zz` | bad random |

## Over 2

Chance `98`. Bank is funded with exactly `winPayout(1000n, 98) - 1000n`. Prefix `62` rolls `99` and pays a positive payout.

No `orng.wax` request is sent. The hex string is an argument.
