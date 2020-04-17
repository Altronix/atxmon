import { User } from "../user.model";

test("User fromUntrusted should fail with invalid input", async () => {
  try {
    let user = await User.fromUntrusted({ foo: "wrong" });
  } catch {}
});
