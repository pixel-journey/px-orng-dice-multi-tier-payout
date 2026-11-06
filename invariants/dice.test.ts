import assert from "node:assert/strict";
import test from "node:test";
import {
  EDGE_BPS,
  emptyBooks,
  place,
  deliver,
  winChance,
  winPayout,
  rollFromByte,
  byte0,
} from "./dice.ts";

test("under 50 has 49% chance, over 50 has 50%", () => {
  assert.equal(winChance("under", 50), 49);
  assert.equal(winChance("over", 50), 50);
});

test("threshold bounds 2..98", () => {
  assert.throws(() => winChance("under", 1), /bad threshold/);
  assert.throws(() => winChance("over", 99), /bad threshold/);
});

test("payout includes 200 bps house edge", () => {
  assert.equal(winPayout(10000n, 50), 19600n);
  assert.equal(EDGE_BPS, 200);
});

test("rollFromByte maps 0..199 fairly and rejects 200+", () => {
  assert.equal(rollFromByte(0), 1);
  assert.equal(rollFromByte(99), 100);
  assert.equal(rollFromByte(100), 1);
  assert.equal(rollFromByte(199), 100);
  assert.equal(rollFromByte(200), "reject");
  assert.equal(rollFromByte(255), "reject");
});

test("win under 50: roll 10 pays from reserve", () => {
  const open = place(emptyBooks(10000n), {
    id: "1",
    player: "alice",
    stake: "10000",
    side: "under",
    threshold: 50,
  });
  assert.equal(open.reserved, (winPayout(10000n, 49) - 10000n).toString());
  const hex = "09" + "22".repeat(31);
  assert.equal(rollFromByte(byte0(hex)), 10);
  const paid = deliver(open, "1", hex);
  assert.equal(paid.bets[0].roll, 10);
  assert.equal(paid.bets[0].payout, winPayout(10000n, 49).toString());
  assert.equal(paid.escrow, "0");
  assert.equal(paid.reserved, "0");
});

test("loss returns stake and reserve to bank", () => {
  const open = place(emptyBooks(10000n), {
    id: "1",
    player: "alice",
    stake: "10000",
    side: "under",
    threshold: 50,
  });
  const hex = "63" + "22".repeat(31);
  const lost = deliver(open, "1", hex);
  assert.equal(lost.bets[0].payout, "0");
  assert.equal(lost.bank, "20000");
});

test("rejected sample does not settle", () => {
  const open = place(emptyBooks(20000n), {
    id: "1",
    player: "bob",
    stake: "100",
    side: "over",
    threshold: 50,
  });
  const hex = "c8" + "33".repeat(31);
  assert.throws(() => deliver(open, "1", hex), /reject sample/);
});

test("bank must cover the extra before place", () => {
  assert.throws(
    () =>
      place(emptyBooks(0n), {
        id: "1",
        player: "alice",
        stake: "10000",
        side: "under",
        threshold: 50,
      }),
    /bank/,
  );
});

test("zero stake refused", () => {
  assert.throws(
    () =>
      place(emptyBooks(100000n), {
        id: "1",
        player: "alice",
        stake: "0",
        side: "under",
        threshold: 50,
      }),
    /bad stake/,
  );
});

test("missing bet and double resolve refused", () => {
  const open = place(emptyBooks(20000n), {
    id: "1",
    player: "alice",
    stake: "100",
    side: "over",
    threshold: 10,
  });
  assert.throws(() => deliver(open, "9", "01" + "11".repeat(31)), /missing bet/);
  const once = deliver(open, "1", "01" + "11".repeat(31));
  assert.throws(() => deliver(once, "1", "01" + "11".repeat(31)), /already resolved/);
});

test("over 2 wins on high roll", () => {
  const chance = winChance("over", 2);
  assert.equal(chance, 98);
  const extra = winPayout(1000n, chance) - 1000n;
  const open = place(emptyBooks(extra), {
    id: "1",
    player: "alice",
    stake: "1000",
    side: "over",
    threshold: 2,
  });
  const hex = "62" + "11".repeat(31);
  const paid = deliver(open, "1", hex);
  assert.equal(paid.bets[0].roll, 99);
  assert.ok(BigInt(paid.bets[0].payout!) > 0n);
});

test("duplicate bet id refused", () => {
  const open = place(emptyBooks(50000n), {
    id: "1",
    player: "alice",
    stake: "100",
    side: "under",
    threshold: 50,
  });
  assert.throws(
    () => place(open, { id: "1", player: "bob", stake: "100", side: "under", threshold: 50 }),
    /duplicate id/,
  );
});

test("bad random hex refused", () => {
  const open = place(emptyBooks(50000n), {
    id: "1",
    player: "alice",
    stake: "100",
    side: "under",
    threshold: 50,
  });
  assert.throws(() => deliver(open, "1", "zz"), /bad random/);
});
