import createServer from "../server";

test("server should load", async () => {
  let server = await createServer();
  expect(server).toBeTruthy();
});
