import { MailerService } from "../mailer.service";
import getMockUtils from "../../common/__tests__/__mocks__/utils.mock";
import * as sg from "@sendgrid/mail";
jest.mock("@sendgrid/mail");

function setup() {
  let mockUtils = getMockUtils();
  let mockMailer = { ...sg } as jest.Mocked<typeof sg>;
  let mailer = new MailerService(mockMailer, mockUtils);
  return { mailer, mockUtils, mockMailer };
}

test("mailer.service should init", async () => {
  let { mockMailer, mailer } = setup();
  mailer.init("foo");
  expect(mockMailer.setApiKey).toBeCalledWith("foo");
  mockMailer.setApiKey.mockReset();
});

test("mailer.service should send", async () => {
  let { mockMailer, mailer } = setup();
  const testMail = {
    to: "foo@mail.com",
    from: "",
    text: "",
    html: "",
    subject: "a subject"
  };
  await mailer.init("").send(testMail);
  expect(mockMailer.send).toBeCalledWith([testMail]);
  mockMailer.send.mockReset();
});

test("mailer.service should send", async () => {
  let { mockMailer, mailer } = setup();
  const testMail = [
    {
      to: "foo@mail.com",
      from: "",
      text: "",
      html: "",
      subject: "a subject"
    }
  ];
  await mailer.init("").send(testMail);
  expect(mockMailer.send).toBeCalledWith(testMail);
  mockMailer.send.mockReset();
});

test("mailer.service should log when no API key is detected", async () => {
  let { mockUtils, mockMailer, mailer } = setup();
  const testMail = [
    {
      to: "foo@mail.com",
      from: "",
      text: "",
      html: "",
      subject: "a subject"
    }
  ];
  await mailer.send(testMail);
  expect(mockMailer.send).toBeCalledTimes(0);
  expect(mockUtils.logger.warn).toHaveBeenCalled();
  mockMailer.send.mockReset();
  mockUtils.logger.warn.mockReset();
});
