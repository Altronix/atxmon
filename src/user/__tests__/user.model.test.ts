import { User } from "../user.model";

test("User fromUntrustedThrowable should fail with invalid input", async () => {
  let pass: boolean = false;
  try {
    let user = await User.fromUntrustedThrowable({ foo: "wrong" });
  } catch (e) {
    pass = true;
  }
  expect(pass).toBe(true);
});

test("User fromUntrustedThrowable should pass with valid input", async () => {
  let pass: boolean = false;
  try {
    let user = await User.fromUntrustedThrowable({
      email: "tom@gmail.com",
      name: "Tom",
      role: 1,
      pass: "01234567890ab"
    });
    pass = true;
  } catch (e) {}
  expect(pass).toBe(true);
});

test("User fromUntrusted should fail with invalid input", async () => {
  let user = await User.fromUntrusted({ foo: "wrong" });
  expect(user).toBe(undefined);
});

test("User fromUntrusted should pass with valid input", async () => {
  let user = await User.fromUntrusted({
    name: "Tom",
    email: "tom@gmail.com",
    role: 1,
    pass: "01234567890ab"
  });
  expect(user).toBeTruthy();
});

test("User from should fail with invalid input", async () => {
  let pass: boolean = false;
  try {
    let user = await User.from({ email: "", name: "", pass: "", role: -1 });
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
      email: "tom@gmail.com",
      role: 1,
      pass: "01234567890ab"
    });
    pass = true;
  } catch (e) {}
  expect(pass).toBe(true);
});

test("User fromPartial pass", async () => {
  // TODO
});

test("User fromPartial fail", async () => {
  // TODO
});
