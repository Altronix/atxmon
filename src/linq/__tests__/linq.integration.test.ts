import "jest";
import { LinqNetwork } from "@altronix/linq-network";

test("Linq should call c binding", () => {
  // We only care that linking with c binding worked OK.
  // TODO Would be cool if we validate version we expect here
  let l = new LinqNetwork();
  expect(l.version()).toBeTruthy();
});
