import { setup } from "./__helpers";

test("Linq should send", async () => {
  let test = setup();
  await test.linq.send("serial", "GET", "/ATX");
  expect(1).toBe(1);
  expect(test.manager.send).toHaveBeenCalledTimes(1);
  test.manager.send.mockClear();
});

test("Linq should on", async () => {
  let test = setup();
  await test.linq.on("ctrlc", () => {});
  expect(test.manager.on).toHaveBeenCalledTimes(1);
  test.manager.on.mockClear();
});

test("Linq should listen with number", async () => {
  let test = setup();
  test.linq.listen(33);
  expect(test.manager.listen).toHaveBeenCalledWith("tcp://*:33");
  expect(test.manager.listen).toHaveBeenCalledTimes(1);
  test.manager.listen.mockClear();
});

test("Linq should listen with string", async () => {
  let test = setup();
  test.linq.listen("tcp://*:33");
  expect(test.manager.listen).toHaveBeenCalledWith("tcp://*:33");
  expect(test.manager.listen).toHaveBeenCalledTimes(1);
  test.manager.listen.mockClear();
});

test("Linq should connect with number", async () => {
  let test = setup();
  test.linq.connect(33);
  expect(test.manager.connect).toHaveBeenCalledWith("tcp://*:33");
  expect(test.manager.connect).toHaveBeenCalledTimes(1);
  test.manager.connect.mockClear();
});

test("Linq should connect with string", async () => {
  let test = setup();
  test.linq.connect("tcp://*:33");
  expect(test.manager.connect).toHaveBeenCalledWith("tcp://*:33");
  expect(test.manager.connect).toHaveBeenCalledTimes(1);
  test.manager.connect.mockClear();
});

test("Linq should run", async () => {
  let test = setup();
  test.linq.run(30);
  expect(test.manager.run).toBeCalledTimes(1);
  test.manager.run.mockClear();
});
