import { User } from "../user.model";

test("User fromUntrusted should fail with invalid input", async () => {
  let pass: boolean = false;
  try {
    let user = await User.fromUntrusted({ foo: "wrong" });
  } catch (e) {
    pass = true;
  }
  expect(pass).toBe(true);
});

test("User fromUntrusted should pass with valid input", async () => {
  let pass: boolean = false;
  try {
    let user = await User.fromUntrusted({
      name: "Tom",
      role: 1,
      pass: "01234567890ab"
    });
    pass = true;
  } catch (e) {}
  expect(pass).toBe(true);
});

test("User from should fail with invalid input", async () => {
  let pass: boolean = false;
  try {
    let user = await User.from({ name: "", pass: "", role: -1 });
  } catch (e) {
    pass = true;
  }
  expect(pass).toBe(true);
});

test("User from should pass with valid input", async () => {
  let pass: boolean = false;
  try {
    let user = await User.from({
      name: "Tom",
      role: 1,
      pass: "01234567890ab"
    });
    pass = true;
  } catch (e) {}
  expect(pass).toBe(true);
});
