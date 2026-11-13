# Worked examples — dice

## Example A — chances

| Side / threshold | Chance |
| --- | --- |
| under 50 | 49 |
| over 50 | 50 |
| under 2 | 1 |
| over 98 | 2 |

## Example B — edge payout

`winPayout(10000n, 50) === 19600n` (2% house edge).

## Example C — rejection

`rollFromByte(199) → 100`; `rollFromByte(200) → "reject"`.

## Example D — insolvent place

Bank smaller than `payout - stake` → `bank` error; no bet row.

## Example E — win vs loss

Win: payout set; reserved and escrow decrease. Loss: payout `0`; bank recovers stake + extra. Second deliver → `already resolved`.
