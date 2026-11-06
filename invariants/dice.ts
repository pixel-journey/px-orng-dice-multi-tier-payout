/**
 * Under/over dice with house edge and bank solvency lock (educational).
 * Roll is rejection-sampled from byte0 into 1..100. No live orng.wax.
 */

export const EDGE_BPS = 200;
export const ROLL_MIN = 1;
export const ROLL_MAX = 100;
export const ACCEPT_BELOW = 200;

export type Side = "under" | "over";

export type Bet = {
  id: string;
  player: string;
  stake: string;
  side: Side;
  threshold: number;
  status: "open" | "resolved";
  roll: number | null;
  payout: string | null;
};

export type Books = {
  bank: string;
  escrow: string;
  reserved: string;
  bets: Bet[];
};

const NAME = /^[a-z1-5.]{1,12}$/;
const U64 = /^(0|[1-9][0-9]{0,19})$/;
const HEX = /^[0-9a-f]{64}$/;

export function emptyBooks(bank: bigint): Books {
  if (bank < 0n) throw new Error("bad bank");
  return { bank: bank.toString(), escrow: "0", reserved: "0", bets: [] };
}

export function winChance(side: Side, threshold: number): number {
  if (!Number.isInteger(threshold) || threshold < 2 || threshold > 98) {
    throw new Error("bad threshold");
  }
  if (side === "under") return threshold - 1;
  return ROLL_MAX - threshold;
}

export function winPayout(stake: bigint, chance: number): bigint {
  if (stake < 1n) throw new Error("bad stake");
  if (!Number.isInteger(chance) || chance < 1 || chance > 99) throw new Error("bad chance");
  return (stake * 100n * BigInt(10000 - EDGE_BPS)) / (BigInt(chance) * 10000n);
}

export function byte0(randomHex: string): number {
  if (!HEX.test(randomHex)) throw new Error("bad random");
  return parseInt(randomHex.slice(0, 2), 16);
}

export function rollFromByte(byte: number): number | "reject" {
  if (!Number.isInteger(byte) || byte < 0 || byte > 255) throw new Error("bad byte");
  if (byte >= ACCEPT_BELOW) return "reject";
  return (byte % 100) + 1;
}

function assertName(name: string): void {
  if (!NAME.test(name) || name.startsWith(".") || name.endsWith(".")) throw new Error("bad name");
}

function u64(value: string, label: string): bigint {
  if (!U64.test(value)) throw new Error("bad " + label);
  const n = BigInt(value);
  if (n > 0xffffffffffffffffn) throw new Error("bad " + label);
  return n;
}

function clone(b: Books): Books {
  return {
    bank: b.bank,
    escrow: b.escrow,
    reserved: b.reserved,
    bets: b.bets.map((x) => ({ ...x })),
  };
}

export function place(
  books: Books,
  input: { id: string; player: string; stake: string; side: Side; threshold: number },
): Books {
  assertName(input.player);
  if (input.side !== "under" && input.side !== "over") throw new Error("bad side");
  const id = u64(input.id, "id");
  const stake = u64(input.stake, "stake");
  if (stake < 1n) throw new Error("bad stake");
  if (books.bets.some((b) => b.id === id.toString())) throw new Error("duplicate id");
  const chance = winChance(input.side, input.threshold);
  const payout = winPayout(stake, chance);
  if (payout < stake) throw new Error("payout below stake");
  const extra = payout - stake;
  const bank = BigInt(books.bank);
  if (bank < extra) throw new Error("bank");
  const next = clone(books);
  next.bank = (bank - extra).toString();
  next.escrow = (BigInt(books.escrow) + stake).toString();
  next.reserved = (BigInt(books.reserved) + extra).toString();
  next.bets.push({
    id: id.toString(),
    player: input.player,
    stake: stake.toString(),
    side: input.side,
    threshold: input.threshold,
    status: "open",
    roll: null,
    payout: null,
  });
  return next;
}

export function deliver(books: Books, id: string, randomHex: string): Books {
  const betId = u64(id, "id").toString();
  if (!HEX.test(randomHex)) throw new Error("bad random");
  const next = clone(books);
  const bet = next.bets.find((b) => b.id === betId);
  if (!bet) throw new Error("missing bet");
  if (bet.status === "resolved") throw new Error("already resolved");
  const face = rollFromByte(byte0(randomHex));
  if (face === "reject") throw new Error("reject sample");
  const stake = BigInt(bet.stake);
  const chance = winChance(bet.side, bet.threshold);
  const payout = winPayout(stake, chance);
  const extra = payout - stake;
  const won = bet.side === "under" ? face < bet.threshold : face > bet.threshold;
  bet.status = "resolved";
  bet.roll = face;
  next.escrow = (BigInt(next.escrow) - stake).toString();
  next.reserved = (BigInt(next.reserved) - extra).toString();
  if (won) {
    bet.payout = payout.toString();
  } else {
    bet.payout = "0";
    next.bank = (BigInt(next.bank) + stake + extra).toString();
  }
  return next;
}
