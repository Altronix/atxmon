import { User, UserEntry } from "../user.model";

const validUser: UserEntry = {
  firstName: "Tom",
  lastName: "Foo",
  phone: "1 515 333 4444",
  email: "tom@gmail.com",
  role: 1,
  password: "01234567890ab",
  devices: [],
  notificationsServerMaintenance: false
};

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
    let user = await User.fromUntrustedThrowable(validUser);
    pass = true;
  } catch (e) {}
  expect(pass).toBe(true);
});

test("User fromUntrusted should fail with invalid input", async () => {
  let user = await User.fromUntrusted({ foo: "wrong" });
  expect(user).toBe(undefined);
});

test("User fromUntrusted should pass with valid input", async () => {
  let user = await User.fromUntrusted(validUser);
  expect(user).toBeTruthy();
});

test("User from should fail with invalid input", async () => {
  let pass: boolean = false;
  try {
    let user = await User.from({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      role: -1,
      notificationsServerMaintenance: false
    });
  } catch (e) {
    pass = true;
  }
  expect(pass).toBe(true);
});

test("User from should pass with valid input", async () => {
  let pass: boolean = false;
  try {
    let user = await User.from(validUser);
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
