import { setup, helpersBeforeAll } from "./__helpers";

beforeAll(async () => helpersBeforeAll());

test("Linq should send", async () => {
  let linq = await setup();
  await linq.send("serial", "GET", "/ATX");
  expect(1).toBe(1);
  expect(linq.manager.send).toHaveBeenCalledTimes(1);
  linq.manager.send.mockClear();
});

test("Linq should on", async () => {
  let linq = await setup();
  await linq.on("ctrlc", () => {});
  expect(linq.manager.on).toHaveBeenCalledTimes(1);
  linq.manager.on.mockClear();
});

test("Linq should listen with number", async () => {
  let linq = await setup();
  linq.listen(33);
  expect(linq.manager.listen).toHaveBeenCalledWith("tcp://*:33");
  expect(linq.manager.listen).toHaveBeenCalledTimes(1);
  linq.manager.listen.mockClear();
});

test("Linq should listen with string", async () => {
  let linq = await setup();
  linq.listen("tcp://*:33");
  expect(linq.manager.listen).toHaveBeenCalledWith("tcp://*:33");
  expect(linq.manager.listen).toHaveBeenCalledTimes(1);
  linq.manager.listen.mockClear();
});

test("Linq should connect with number", async () => {
  let linq = await setup();
  linq.connect(33);
  expect(linq.manager.connect).toHaveBeenCalledWith("tcp://*:33");
  expect(linq.manager.connect).toHaveBeenCalledTimes(1);
  linq.manager.connect.mockClear();
});

test("Linq should connect with string", async () => {
  let linq = await setup();
  linq.connect("tcp://*:33");
  expect(linq.manager.connect).toHaveBeenCalledWith("tcp://*:33");
  expect(linq.manager.connect).toHaveBeenCalledTimes(1);
  linq.manager.connect.mockClear();
});

test("Linq should run", async () => {
  let linq = await setup();
  linq.run(30);
  expect(linq.manager.run).toBeCalledTimes(1);
  linq.manager.run.mockClear();
});
