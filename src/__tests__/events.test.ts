import { AlertEvent } from "../device/linq.service";
import { EmailEvent } from "../events";

const events = [
  { type: "email", serial: "serial0", mesg: "mesg0" },
  { type: "email", serial: "serial1", mesg: "mesg1" },
  { type: "email", serial: "serial2", mesg: "mesg2" },
  { type: "email", serial: "serial3", mesg: "mesg3" },
  { type: "email", serial: "serial0", mesg: "mesg4" },
  { type: "email", serial: "serial1", mesg: "mesg5" },
  { type: "email", serial: "serial2", mesg: "mesg6" },
  { type: "email", serial: "serial3", mesg: "mesg7" }
];

test("should buffer alerts by serial", () => {
  // TODO need marble testing
  /*
  let ret = mapEmailToDevice(events as AlertEvent[]);
  expect(ret).toEqual({
    serial0: [
      { type: "email", serial: "serial0", mesg: "mesg0" },
      { type: "email", serial: "serial0", mesg: "mesg4" }
    ],
    serial1: [
      { type: "email", serial: "serial1", mesg: "mesg1" },
      { type: "email", serial: "serial1", mesg: "mesg5" }
    ],
    serial2: [
      { type: "email", serial: "serial2", mesg: "mesg2" },
      { type: "email", serial: "serial2", mesg: "mesg6" }
    ],
    serial3: [
      { type: "email", serial: "serial3", mesg: "mesg3" },
      { type: "email", serial: "serial3", mesg: "mesg7" }
    ]
  });
  */
});
