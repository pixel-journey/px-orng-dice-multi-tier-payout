# Education

## Rejection sampling

Mapping `uint8 % 100` from a full 0..255 range biases some outcomes. This lab accepts only bytes 0..199 (exactly two full cycles of 1..100) and rejects the rest so the roll is uniform.

## Solvency lock

At place time the house reserves `payout - stake` from `bank`. A second bet that needs more than remaining bank is refused. Wins draw the reserve; losses return stake and reserve to the bank.

## House edge

`winPayout = stake * 100 * (10000 - 200) / (chance * 10000)` — integer floor, never rounds up in the player's favor.
