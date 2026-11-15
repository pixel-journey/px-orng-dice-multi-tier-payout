# Tips

- Reserve `payout - stake` at `place`, not at `deliver`. A win that the bank cannot cover should never be accepted.
- Under 50 is 49 chances (rolls 1..49), not 50. That off-by-one is the test `winChance("under", 50) === 49`.
- Bytes 200..255 are a rerequest, same idea as the coinflip lab's 254..255, with a different modulus.
- `19600` is the payout for chance 50 and stake `10000` after a 200 bps edge. Do not reuse that number for under-50, whose chance is 49.
- A rejected sample must not move escrow. The test throws before settle.
