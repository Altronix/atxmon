import { LoginModel } from "../login.model";
let testEmail = { email: "foo@gmail.com", password: "111111111111" };
test("login.model should validate", async () => {
  let login = await LoginModel.fromUntrusted(testEmail);
  expect(login.email).toBe(testEmail.email);
  expect(login.email).toBe(testEmail.email);
});

test("login.model should invalidate", async () => {
  let login = await LoginModel.fromUntrusted({ foo: "bad" }).catch(() => "val");
  expect(login).toBe("val");
});
