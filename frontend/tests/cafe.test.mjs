import assert from "node:assert/strict";
import {
  cafeReducer as reduce,
  initialCafeState,
  visitorsAt,
  stepsFor,
  visitKey,
  recipeSummary,
} from "../src/cafe/game.js";
let s = structuredClone(initialCafeState);
const act = (type, rest = {}) => (s = reduce(s, { type, ...rest }));
assert.deepEqual(
  visitorsAt(480).map((a) => a.id),
  ["momo"],
);
assert.equal(visitorsAt(1320).length, 0);
assert.deepEqual(
  visitorsAt(1440 + 600).map((a) => a.id),
  ["momo", "hazel"],
);
act("TOPPING", { id: "blueberry" });
act("TOPPING", { id: "flower" });
assert.equal(s.recipe.toppings.length, 3);
act("SET", { key: "kind", value: "cake" });
act("SET", { key: "name", value: "草莓云朵" });
act("SAVE");
act("SAVE");
assert.equal(s.collection.length, 1);
act("START");
act("SET", { key: "flavor", value: "cocoa" });
assert.equal(s.job.recipe.flavor, "strawberry");
act("FINISH");
assert.equal(s.shelf.length, 0);
for (let i = 0; i < 3; i++) {
  const duration = stepsFor(s.job.recipe)[i].duration;
  act("STEP", { now: 10000 });
  act("TICK", { now: 10000 + duration - 1 });
  assert.equal(s.job.step, i);
  act("STEP", { now: 11000 });
  assert.equal(s.job.startedAt, 10000);
  act("TICK", { now: 10000 + duration });
  assert.equal(s.job.step, i + 1);
}
act("FINISH");
assert.equal(s.shelf.length, 1);
assert.equal(s.shelf[0].title, "草莓云朵");
const item = s.shelf[0];
act("SERVE", { visitor: "momo", item: item.id });
assert.equal(s.stars, 3);
assert.equal(s.shelf.length, 0);
assert(s.served[visitKey(s.minutes, "momo")]);
s = { ...s, shelf: [item] };
act("SERVE", { visitor: "momo", item: item.id });
assert.equal(s.stars, 3);
assert.equal(s.shelf.length, 1);
act("ADVANCE", { minutes: 1440 });
act("SERVE", { visitor: "momo", item: item.id });
assert.equal(s.stars, 6);
s = { ...s, shelf: Array.from({ length: 8 }, (_, id) => ({ ...item, id })) };
act("START");
assert.equal(s.job, null);
s = { ...s, shelf: [] };
act("START");
act("CANCEL");
assert.equal(s.job, null);
assert.equal(s.recipe.name, "草莓云朵");
assert(recipeSummary(s).includes("本地模拟"));
assert(s.events.some((e) => e.action === "serve"));
console.log(
  "PASS schedules, daily serving limit, flavor matching, capacity, step timers, frozen recipes, cancel, collections and structured events",
);
